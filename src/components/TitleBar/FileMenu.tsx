import React, { useContext, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import { path } from '@tauri-apps/api';
import { notification } from '@tauri-apps/api';
import { store } from '../../store';
import { WarningModal } from '../../components';

interface Props {
  active: boolean;
  innerRef: React.RefObject<HTMLDivElement>;
  setActive: (active: boolean) => void;
}

// FUTURE WORK
// const handleNewProject = async () => {
//   const name = await open({
//     directory: true,
//     multiple: false,
//   });
// };

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
      .then((res) => res)
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
      console.log(game_name, game_folder);
      set_game_folder(game_folder);
      set_game_name(game_name);
      const game_state = await invoke('load_game', {
        gameFolder: project_folder,
      });
      console.log(game_state);
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
    </>
  );
};
