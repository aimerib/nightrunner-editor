import React, { useContext, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import { path } from '@tauri-apps/api';
import { notification } from '@tauri-apps/api';
import { store } from '../../store';
import { Modal, WarningModal } from '../../components';
import { GAME_SETTINGS_TYPE } from '../../types';
import title_bar from './title_bar.module.css';

interface Props {
  active: boolean;
  innerRef: React.RefObject<HTMLDivElement>;
  setActive: (active: boolean) => void;
}

const notify = (text: string) => {
  const message = {
    title: 'Nightrunner Editor',
    body: text,
    icon: '',
  };
  if (notification.isPermissionGranted) {
    notification.sendNotification(message);
  } else {
    notification.requestPermission().then((permission) => {
      if (permission) {
        notification.sendNotification(message);
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
  const handle_new_game = () => {
    new_game();
  };

  const handle_save_game = () => {
    const game_state_array = Object.keys(gameState).map((key) => {
      return { [key]: gameState[key][0] };
    });
    // eslint-disable-next-line no-empty-pattern
    const parsed_game_state = game_state_array.reduce((acc, curr, {}) => {
      return { ...acc, ...curr };
    });
    invoke('save_game', { gameState: parsed_game_state })
      .then((res) => {
        notify(res as string);
        set_show_saved_warning(true);
      })
      .catch((err) => console.error(err));
    setActive(false);
  };

  const handle_load_game = async () => {
    const home_folder: string = await invoke('get_home_folder');
    const project_folder = await open({
      directory: true,
      multiple: false,
      defaultPath: home_folder,
    });
    if (project_folder && !Array.isArray(project_folder)) {
      const project_folder_strings = project_folder.split(path.sep);
      const game_name =
        project_folder_strings[project_folder_strings.length - 1];
      const game_folder = project_folder_strings.slice(0, -1).join(path.sep);
      set_game_folder(game_folder);
      set_game_name(game_name);
      const game_state: GAME_SETTINGS_TYPE = await invoke('load_game', {
        gameFolder: project_folder,
      });
      load_game(game_state);
    } else {
      notify("Couldn't open project");
    }
  };

  return (
    <>
      <div
        ref={innerRef}
        className={`${
          active ? 'visible' : 'hidden'
        } z-50 absolute bg-gray-900 text-green-nr w-1/12 ${
          title_bar.menu_area
        } ${title_bar.menu_background}`}
      >
        <a
          className={title_bar.menu_item}
          onClick={() => {
            setActive(false);
            set_show_warning(true);
          }}
        >
          New Game
        </a>
        <a className={title_bar.menu_item} onClick={handle_save_game}>
          Save Game
        </a>
        <a
          className={title_bar.menu_item}
          onClick={() => {
            setActive(false);
            handle_load_game();
          }}
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
    </>
  );
};
