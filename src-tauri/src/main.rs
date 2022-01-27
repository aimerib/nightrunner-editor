#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};
use std::collections::{BTreeMap, HashMap};
use std::fs;
use tauri::api::dir::DiskEntry;
use tauri::api::{dir::read_dir, path};

// region: types
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq)]
pub struct Room {
  pub id: u16,
  pub name: String,
  pub description: String,
  pub exits: Vec<Exits>,
  pub stash: Storage,
  pub room_events: Vec<u16>,
  pub narrative: u16,
  pub subjects: Vec<u16>,
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq)]
pub struct Exits {
  pub room_id: u16,
  pub direction: Directions,
}

#[derive(Clone, Debug, Deserialize, Serialize, PartialEq)]
pub enum Directions {
  EAST,
  NORTH,
  SOUTH,
  WEST,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Storage {
  pub items: Vec<Item>,
  pub item_ids: Vec<u16>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Item {
  pub id: u16,
  pub name: String,
  pub description: String,
  pub can_pick: bool,
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq)]
pub struct Narrative {
  pub id: u16,
  pub text: String,
  pub description: String,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Verb {
  pub id: u16,
  // pub name: String,
  pub names: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Event {
  pub id: u16,
  pub name: String,
  pub description: String,
  pub location: u16,
  pub destination: Option<u16>,
  pub narrative: Option<u16>,
  pub required_verb: Option<u16>,
  pub required_subject: Option<u16>,
  pub required_item: Option<u16>,
  #[serde(default)]
  pub completed: bool,
  pub add_item: Option<u16>,
  pub remove_old_narrative: bool,
  pub remove_item: Option<u16>,
  pub required_events: Vec<u16>,
}

impl Default for Event {
  fn default() -> Self {
    Event {
      id: 0,
      name: "".to_string(),
      description: "".to_string(),
      location: 0,
      destination: None,
      narrative: None,
      required_verb: None,
      required_subject: None,
      required_item: None,
      completed: false,
      add_item: None,
      remove_old_narrative: false,
      remove_item: None,
      required_events: Vec::new(),
    }
  }
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Subject {
  pub id: u16,
  pub name: String,
  pub description: String,
}
// endregion

#[tauri::command]
fn get_home_folder() -> String {
  let path = path::home_dir();
  if let Some(home_folder) = path {
    let path_string = home_folder.into_os_string().into_string().unwrap();
    path_string
  } else {
    // Change this to a result and handle on frontend
    println!("No home folder found");
    '/'.to_string()
  }
}

#[tauri::command]
fn save_game(game_state: HashMap<String, serde_json::Value>) -> Result<String, String> {
  let subjects = get_subjects_from_state(&game_state);
  let events = get_events_from_state(&game_state);
  let items = get_items_from_state(&game_state);
  let rooms = get_rooms_from_state(&game_state);
  let narratives = get_narratives_from_state(&game_state);
  let verbs = get_verbs_from_state(&game_state);

  let path: String = serde_json::from_value(game_state.get("folder").unwrap().clone()).unwrap();
  let name: String = serde_json::from_value(game_state.get("name").unwrap().clone()).unwrap();
  let intro: String = serde_json::from_value(game_state.get("intro").unwrap().clone()).unwrap();

  #[derive(Debug)]
  enum GameData<'a> {
    Rooms(&'a (String, BTreeMap<i32, Room>)),
    Subjects(&'a (String, Vec<Subject>)),
    Events(&'a (String, BTreeMap<i32, Event>)),
    Items(&'a (String, Vec<Item>)),
    Narratives(&'a (String, Vec<Narrative>)),
    Verbs(&'a (String, Vec<Verb>)),
  }

  if path.is_empty() {
    return Err("No path specified to save game".to_string());
  } else {
    let state_items = [
      GameData::Subjects(&subjects),
      GameData::Events(&events),
      GameData::Items(&items),
      GameData::Rooms(&rooms),
      GameData::Narratives(&narratives),
      GameData::Verbs(&verbs),
    ];
    let state_items_iter = state_items.iter();
    let game_path = format!("{}/{}", path, name);
    fs::create_dir_all(&game_path).expect("Could not create directory");
    for state_item in state_items_iter {
      match state_item {
        GameData::Rooms((key, rooms)) => {
          fs::write(
            format!("{}/{}.yml", &game_path, key),
            serde_yaml::to_string(&rooms).unwrap(),
          )
          .expect("Unable to write files to system");
        }
        GameData::Events((key, events)) => {
          fs::write(
            format!("{}/{}.yml", &game_path, key),
            serde_yaml::to_string(&events).unwrap(),
          )
          .expect("Unable to write files to system");
        }
        GameData::Items((key, items)) => {
          fs::write(
            format!("{}/{}.yml", &game_path, key),
            serde_yaml::to_string(&items).unwrap(),
          )
          .expect("Unable to write files to system");
        }
        GameData::Subjects((key, subjects)) => {
          fs::write(
            format!("{}/{}.yml", &game_path, key),
            serde_yaml::to_string(&subjects).unwrap(),
          )
          .expect("Unable to write files to system");
        }
        GameData::Narratives((key, narratives)) => {
          fs::write(
            format!("{}/{}.yml", &game_path, key),
            serde_yaml::to_string(&narratives).unwrap(),
          )
          .expect("Unable to write files to system");
        }
        GameData::Verbs((key, verbs)) => {
          fs::write(
            format!("{}/{}.yml", &game_path, key),
            serde_yaml::to_string(&verbs).unwrap(),
          )
          .expect("Unable to write files to system");
        }
      }
    }
    fs::write(
      format!("{}/intro.yml", &game_path),
      serde_yaml::to_string(&intro).unwrap(),
    )
    .expect("Unable to write files to system");
    return Ok("Game Successfuly Saved".to_string());
  }
}

#[tauri::command]
fn load_game(game_folder: String) -> Result<BTreeMap<String, Value>, String> {
  let all_files = read_dir(&game_folder, false).unwrap();
  let game_files = all_files
    .iter()
    .filter(|file| file.children.is_none() && file.name.as_ref().unwrap().ends_with(".yml"))
    .collect::<Vec<&DiskEntry>>();
  let files_strings = game_files
    .iter()
    .map(|file| {
      (
        file.name.clone().unwrap(),
        file.path.to_str().unwrap().to_string(),
      )
    })
    .collect::<Vec<(String, String)>>();
  if is_game_folder(&files_strings) {
    let game_files_raw = files_strings
      .iter()
      .map(|file| {
        let file_name = file.0.clone().split(".").next().unwrap().to_string();
        let file_path = file.1.clone();
        let file_string = fs::read_to_string(&file_path).unwrap();
        (file_name, file_string)
      })
      .collect::<HashMap<String, String>>();
    let intro: String = serde_yaml::from_str(&game_files_raw.get("intro").unwrap()).unwrap();
    let subjects: Vec<Subject> =
      serde_yaml::from_str(&game_files_raw.get("subjects").unwrap()).unwrap();
    let events: BTreeMap<i32, Event> =
      serde_yaml::from_str(&game_files_raw.get("events").unwrap()).unwrap();
    let items: Vec<Item> = serde_yaml::from_str(&game_files_raw.get("items").unwrap()).unwrap();
    let rooms: BTreeMap<i32, Room> =
      serde_yaml::from_str(&game_files_raw.get("rooms").unwrap()).unwrap();
    let narratives: Vec<Narrative> =
      serde_yaml::from_str(&game_files_raw.get("narratives").unwrap()).unwrap();
    let verbs: Vec<Verb> = serde_yaml::from_str(&game_files_raw.get("verbs").unwrap()).unwrap();

    let mut game_state: BTreeMap<String, Value> = BTreeMap::new();
    game_state.insert("intro".to_string(), serde_json::to_value(intro).unwrap());
    game_state.insert(
      "subjects".to_string(),
      serde_json::to_value(subjects).unwrap(),
    );
    game_state.insert("events".to_string(), serde_json::to_value(events).unwrap());
    game_state.insert("items".to_string(), serde_json::to_value(items).unwrap());
    game_state.insert("rooms".to_string(), serde_json::to_value(rooms).unwrap());
    game_state.insert(
      "narratives".to_string(),
      serde_json::to_value(narratives).unwrap(),
    );
    game_state.insert("verbs".to_string(), serde_json::to_value(verbs).unwrap());

    return Ok(game_state);
  }
  return Err("Not a valid game folder".to_string());
}

fn is_game_folder(game_files: &Vec<(String, String)>) -> bool {
  let required_files = [
    "intro.yml",
    "subjects.yml",
    "events.yml",
    "items.yml",
    "rooms.yml",
    "narratives.yml",
    "verbs.yml",
  ];
  let file_names = game_files
    .iter()
    .map(|(name, _path)| name.clone())
    .collect::<Vec<String>>();
  required_files
    .iter()
    .all(|file| file_names.contains(&file.to_string()))
}

fn get_rooms_from_state(
  game_state: &HashMap<String, serde_json::Value>,
) -> (String, BTreeMap<i32, Room>) {
  let (json_key, json_value) = game_state.get_key_value("rooms").unwrap();
  let value: Map<String, serde_json::Value> = serde_json::from_value(json_value.clone()).unwrap();
  dbg!(&value);
  let rooms = value
    .iter()
    .map(|(k, v)| {
      (
        k.parse::<i32>().unwrap(),
        serde_json::from_value::<Room>(v.clone()).unwrap(),
      )
    })
    .collect::<BTreeMap<i32, _>>();
  (json_key.clone(), rooms)
}

fn get_events_from_state(
  game_state: &HashMap<String, serde_json::Value>,
) -> (String, BTreeMap<i32, Event>) {
  let (json_key, json_value) = game_state.get_key_value("events").unwrap();
  let value: Map<String, serde_json::Value> = serde_json::from_value(json_value.clone()).unwrap();
  let events = value
    .iter()
    .map(|(k, v)| {
      (
        k.parse::<i32>().unwrap(),
        serde_json::from_value::<Event>(v.clone()).unwrap(),
      )
    })
    .collect::<BTreeMap<i32, _>>();
  (json_key.clone(), events)
}

fn get_verbs_from_state(game_state: &HashMap<String, serde_json::Value>) -> (String, Vec<Verb>) {
  let (json_key, json_value) = game_state.get_key_value("verbs").unwrap();
  let value: Vec<serde_json::Value> = serde_json::from_value(json_value.clone()).unwrap();
  let verbs = value
    .iter()
    .map(|v| serde_json::from_value::<Verb>(v.clone()).unwrap())
    .collect::<Vec<Verb>>();
  (json_key.clone(), verbs)
}

fn get_items_from_state(game_state: &HashMap<String, serde_json::Value>) -> (String, Vec<Item>) {
  let (json_key, json_value) = game_state.get_key_value("items").unwrap();
  let value: Vec<serde_json::Value> = serde_json::from_value(json_value.clone()).unwrap();
  let items = value
    .iter()
    .map(|v| serde_json::from_value::<Item>(v.clone()).unwrap())
    .collect::<Vec<Item>>();
  (json_key.clone(), items)
}

fn get_subjects_from_state(
  game_state: &HashMap<String, serde_json::Value>,
) -> (String, Vec<Subject>) {
  let (json_key, json_value) = game_state.get_key_value("subjects").unwrap();
  let value: Vec<serde_json::Value> = serde_json::from_value(json_value.clone()).unwrap();
  let subjects = value
    .iter()
    .map(|v| serde_json::from_value::<Subject>(v.clone()).unwrap())
    .collect::<Vec<Subject>>();
  (json_key.clone(), subjects)
}

fn get_narratives_from_state(
  game_state: &HashMap<String, serde_json::Value>,
) -> (String, Vec<Narrative>) {
  let (json_key, json_value) = game_state.get_key_value("narratives").unwrap();
  let value: Vec<serde_json::Value> = serde_json::from_value(json_value.clone()).unwrap();
  let narratives = value
    .iter()
    .map(|v| serde_json::from_value::<Narrative>(v.clone()).unwrap())
    .collect::<Vec<Narrative>>();
  (json_key.clone(), narratives)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      get_home_folder,
      save_game,
      load_game
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
