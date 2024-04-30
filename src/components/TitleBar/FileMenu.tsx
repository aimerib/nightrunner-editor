import './TitleBar.css';

// import { Item, Narrative, Room, Subject, Verb } from '@nightrunner/nightrunner_lib';
import { path } from '@tauri-apps/api';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import React, { useContext, useState } from 'react';

import { Modal, WarningModal } from '../../components';
import { store } from '../../store';
import { GAME_SETTINGS, GAME_STATE } from '../../types';


interface Props {
  active: boolean;
  innerRef: React.RefObject<HTMLDivElement>;
  setActive: (active: boolean) => void;
}

const notify = async (text: string) => {
  const message = {
    title: 'Nightrunner Editor',
    body: text,
    icon: '',
  };
  const notificationPermission = await isPermissionGranted();
  if (notificationPermission) {
    sendNotification(message);
  } else {
    requestPermission().then((permission) => {
      if (permission) {
        sendNotification(message);
      } else {
        console.error('Permission not granted');
      }
    });
  }
};

export const FileMenu = ({ active, innerRef, setActive }: Props) => {
  const { new_game } = useContext(store);
  const { gameState } = useContext(store);
  const { load_game } = useContext(store);
  const [show_saved_warning, set_show_saved_warning] = useState(false);
  const set_game_name = gameState.name[1];
  const set_game_folder = gameState.folder[1];
  const [show_warning, set_show_warning] = useState(false);
  const [show_saved_error, set_show_saved_error] = useState(false);

  const handle_save_game = () => {
    const game_state_array = Object.entries(gameState).map(([key, value]) => ({
      [key]: value[0],
    }));
    const parsed_game_state = game_state_array.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});
    if (isValidGameState(gameState)) {
      invoke('save_game', { gameState: parsed_game_state })
        .then((res) => {
          notify(res as string);
          set_show_saved_warning(true);
        })
        .catch((err) => console.error(err));
      setActive(false);
    } else {
      notify('Game state is invalid');
      set_show_saved_error(true);
    }
  };

  const handle_load_game = async () => {
    setActive(false);
    const home_folder: string = await invoke('get_home_folder');
    const project_folder = await open({
      directory: true,
      multiple: false,
      defaultPath: home_folder,
    });
    if (project_folder) {
      const project_folder_strings = project_folder.split(path.sep());
      const game_name =
        project_folder_strings[project_folder_strings.length - 1];
      const game_folder = project_folder_strings.slice(0, -1).join(path.sep());
      set_game_folder(game_folder);
      set_game_name(game_name);
      try {
        const game_state: GAME_SETTINGS = await invoke('load_game', {
          gameFolder: project_folder,
        });
        load_game(game_state);
      } catch (err) {
        notify(err as string);
      }
    } else {
      notify("Couldn't open project");
    }
  };

  const handle_new_game = async () => {
    new_game();
  };

  function isValidGameState(state: GAME_STATE): boolean {
    // Check if the required properties are not empty strings
    if (!state.name || !state.intro || !state.folder) {
      return false;
    }

    // Check if the arrays are not empty
    const arrays: Array<keyof GAME_SETTINGS> = ['events', 'items', 'narratives', 'rooms', 'subjects', 'verbs'];
    for (const arr of arrays) {
      if (state[arr].length < 1) {
        return false;
      }
    }

    // If all checks pass, the game state is valid
    return true;
  }

  return (
    <>
      <div
        ref={innerRef}
        className={`${active ? 'visible' : 'hidden'
          } z-50 absolute bg-gray-900 text-green-nr w-1/12 menu_area menu_background`}
      >
        <a
          className="menu_item"
          onClick={() => {
            setActive(false);
            set_show_warning(true);
          }}
        >
          New Game
        </a>
        <a className="menu_item" onClick={handle_save_game}>
          Save Game
        </a>
        <a
          className="menu_item"
          onClick={handle_load_game}
        >
          Load Game
        </a>
      </div>
      <WarningModal
        show={show_warning}
        handle_close={() => set_show_warning(false)}
        title="Are you sure?"
        callback={handle_new_game}
      >
        <p>This will discard any unsaved progress.</p>
      </WarningModal>
      <Modal
        show={show_saved_warning}
        handle_close={() => set_show_saved_warning(false)}
        title="Success!"
      >
        <p>Game saved.</p>
      </Modal>
      <Modal
        show={show_saved_error}
        handle_close={() => set_show_saved_error(false)}
        title="Error!"
      >
        <p>Game failed to save.</p>
      </Modal>
    </>
  );
};
