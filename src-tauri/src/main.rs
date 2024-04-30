#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use directories::UserDirs;
use nightrunner_lib::config::{Event, Item, Narrative, Room, RoomBlueprint, Subject, Verb};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use std::fs::{self, read_dir, DirEntry};

#[tauri::command]
fn get_home_folder() -> String {
  if let Some(user_dirs) = UserDirs::new() {
    let home_folder = user_dirs.home_dir();
    let path_string = home_folder.to_string_lossy().to_string();
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
  let rooms: (String, Vec<Room>) = get_rooms_from_state(&game_state);
  let narratives = get_narratives_from_state(&game_state);
  let verbs = get_verbs_from_state(&game_state);

  let path: String = serde_json::from_value(game_state.get("folder").unwrap().clone()).unwrap();
  let name: String = serde_json::from_value(game_state.get("name").unwrap().clone()).unwrap();
  let intro: String = serde_json::from_value(game_state.get("intro").unwrap().clone()).unwrap();

  #[derive(Debug)]
  enum GameData<'a> {
    Rooms(&'a (String, Vec<Room>)),
    Subjects(&'a (String, Vec<Subject>)),
    Events(&'a (String, Vec<Event>)),
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
        GameData::Rooms((_, rooms)) => {
          let room_blueprints = rooms
            .iter()
            .map(|room| room.into_room_blueprint())
            .collect::<Vec<RoomBlueprint>>();
          fs::write(
            format!("{}/{}.yml", &game_path, "room_blueprints"),
            serde_yaml::to_string(&room_blueprints).unwrap(),
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
fn load_game(game_folder: String) -> Result<Value, String> {
  let all_files = read_dir(&game_folder).unwrap();
  let game_files = all_files
    .filter(|file| {
      file.as_ref().unwrap().file_type().unwrap().is_file()
        && file
          .as_ref()
          .unwrap()
          .file_name()
          .to_str()
          .unwrap()
          .ends_with(".yml")
    })
    .map(|file| file.unwrap())
    .collect::<Vec<DirEntry>>();
  let files_strings = game_files
    .iter()
    .map(|file| {
      (
        file.file_name().to_str().unwrap().to_string(),
        file.path().to_str().unwrap().to_string(),
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
    let events: Vec<Event> = serde_yaml::from_str(&game_files_raw.get("events").unwrap()).unwrap();
    let items: Vec<Item> = serde_yaml::from_str(&game_files_raw.get("items").unwrap()).unwrap();
    let room_blueprints: Vec<RoomBlueprint> =
      serde_yaml::from_str(&game_files_raw.get("room_blueprints").unwrap()).unwrap();
    let rooms = Room::build_rooms(&room_blueprints, &events, &items, &subjects);
    let narratives: Vec<Narrative> =
      serde_yaml::from_str(&game_files_raw.get("narratives").unwrap()).unwrap();
    let verbs: Vec<Verb> = serde_yaml::from_str(&game_files_raw.get("verbs").unwrap()).unwrap();

    let game_state = GameState {
      intro,
      subjects,
      events,
      items,
      rooms,
      narratives,
      verbs,
    };

    let json = serde_json::to_value(&game_state).unwrap();
    return Ok(json);
  }
  return Err("Not a valid game folder".to_string());
}

fn is_game_folder(game_files: &Vec<(String, String)>) -> bool {
  let required_files = [
    "intro.yml",
    "subjects.yml",
    "events.yml",
    "items.yml",
    "room_blueprints.yml",
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
) -> (String, Vec<Room>) {
  let (json_key, json_value) = game_state.get_key_value("rooms").unwrap();
  let rooms: Vec<Room> = serde_json::from_value(json_value.clone()).unwrap();
  (json_key.clone(), rooms)
}

fn get_events_from_state(
  game_state: &HashMap<String, serde_json::Value>,
) -> (String, Vec<Event>) {
  let (json_key, json_value) = game_state.get_key_value("events").unwrap();
  print!("{:?}", json_value);
  let events: Vec<Event> = serde_json::from_value(json_value.clone()).unwrap();
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
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_notification::init())
    .invoke_handler(tauri::generate_handler![
      get_home_folder,
      save_game,
      load_game
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[derive(Serialize, Deserialize)]
struct GameState {
  intro: String,
  subjects: Vec<Subject>,
  events: Vec<Event>,
  items: Vec<Item>,
  rooms: Vec<Room>,
  narratives: Vec<Narrative>,
  verbs: Vec<Verb>,
}
