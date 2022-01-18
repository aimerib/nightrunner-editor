#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde_json::Map;
use std::collections::{BTreeMap, HashMap};
use std::fs;
use tauri::api::path;

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
fn load_game(game_folder: String) {
  println!("{}", game_folder);
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
