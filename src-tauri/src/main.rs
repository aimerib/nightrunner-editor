#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};
use std::collections::{BTreeMap, HashMap};
use std::fs;
use tauri::api::{dir::read_dir, path};

// region: types
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq)]
pub struct Room {
  pub id: u16,
  pub name: String,
  pub description: String,
  pub exits: Vec<Exits>,
  pub stash: Storage,
  // pub narratives: Vec<u16>,
  pub room_events: Vec<u16>,
  pub narrative: u16,
  // pub previous_narrative: u16,
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
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Verb {
  pub id: u16,
  pub names: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize)]
pub struct Event {
  pub id: u16,
  pub location: u16,
  pub destination: Option<u16>,
  pub narrative: Option<u16>,
  pub required_verb: Option<u16>,
  pub required_subject: Option<u16>,
  pub required_item: Option<u16>,
  pub completed: bool,
  pub add_item: Option<u16>,
  pub remove_old_narrative: bool,
  pub remove_item: Option<u16>,
  pub required_events: Vec<u16>,
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
  let subjects = get_game_state(&game_state, "subjects");
  let events = get_game_state(&game_state, "events");
  let items = get_game_state(&game_state, "items");
  let rooms = get_game_state(&game_state, "rooms");
  let narratives = get_game_state(&game_state, "narratives");
  let verbs = get_game_state(&game_state, "verbs");

  let path: String = serde_json::from_value(game_state.get("folder").unwrap().clone()).unwrap();
  let name: String = serde_json::from_value(game_state.get("name").unwrap().clone()).unwrap();
  let intro: String = serde_json::from_value(game_state.get("intro").unwrap().clone()).unwrap();

  if path.is_empty() {
    return Err("No path specified to save game".to_string());
  } else {
    let state_items = [&subjects, &events, &items, &rooms, &narratives, &verbs];
    let state_items_iter = state_items.iter();
    let game_path = format!("{}/{}", path, name);
    fs::create_dir_all(&game_path).expect("Could not create directory");
    for (key, value) in state_items_iter {
      fs::write(
        format!("{}/{}.yaml", &game_path, key),
        serde_yaml::to_string(&value).unwrap(),
      )
      .expect("Unable to write files to system");
    }
    fs::write(
      format!("{}/intro.yaml", &game_path),
      serde_yaml::to_string(&intro).unwrap(),
    )
    .expect("Unable to write files to system");
    return Ok("Game Successfuly Saved".to_string());
  }
}

#[tauri::command]
fn load_game(game_folder: String) -> Result<BTreeMap<String, Value>, String> {
  let files = read_dir(&game_folder, false).unwrap();
  let files_strings = files
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
    let subjects: BTreeMap<i32, Subject> =
      serde_yaml::from_str(&game_files_raw.get("subjects").unwrap()).unwrap();
    let events: BTreeMap<i32, Event> =
      serde_yaml::from_str(&game_files_raw.get("events").unwrap()).unwrap();
    let items: BTreeMap<i32, Item> =
      serde_yaml::from_str(&game_files_raw.get("items").unwrap()).unwrap();
    let rooms: BTreeMap<i32, Room> =
      serde_yaml::from_str(&game_files_raw.get("rooms").unwrap()).unwrap();
    let narratives: BTreeMap<i32, Narrative> =
      serde_yaml::from_str(&game_files_raw.get("narratives").unwrap()).unwrap();
    let verbs: BTreeMap<i32, Verb> =
      serde_yaml::from_str(&game_files_raw.get("verbs").unwrap()).unwrap();

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

    println!("{:?}", &game_state);
    return Ok(game_state);
  }
  return Err("Not a valid game folder".to_string());
}

fn is_game_folder(game_files: &Vec<(String, String)>) -> bool {
  let required_files = [
    "intro.yaml",
    "subjects.yaml",
    "events.yaml",
    "items.yaml",
    "rooms.yaml",
    "narratives.yaml",
    "verbs.yaml",
  ];
  let file_names = game_files
    .iter()
    .map(|(name, _path)| name.clone())
    .collect::<Vec<String>>();
  required_files
    .iter()
    .all(|file| file_names.contains(&file.to_string()))
}

fn get_game_state(
  game_state: &HashMap<String, serde_json::Value>,
  key: &str,
) -> (String, BTreeMap<i32, serde_json::Value>) {
  let (json_key, json_value) = game_state.get_key_value(key).unwrap();
  let value: Map<String, serde_json::Value> = serde_json::from_value(json_value.clone()).unwrap();
  (json_key.clone(), value.parse_key())
}

trait ParseKey {
  fn parse_key(&self) -> BTreeMap<i32, serde_json::Value>;
}

impl ParseKey for Map<String, serde_json::Value> {
  fn parse_key(&self) -> BTreeMap<i32, serde_json::Value> {
    self
      .iter()
      .map(|(k, v)| (k.parse::<i32>().unwrap(), v.clone()))
      .collect::<BTreeMap<i32, _>>()
  }
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
