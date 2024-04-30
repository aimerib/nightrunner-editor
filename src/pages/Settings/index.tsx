import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { useContext, useEffect, useState } from 'react';

import { Button, Input } from '../../components';
import { store } from '../../store';
import { ButtonType } from '../../types';

export default function Settings(): JSX.Element {
  const { gameState } = useContext(store);
  const [game_folder, set_game_folder] = gameState.folder;
  const [game_name, set_game_name] = gameState.name;
  const [game_intro, set_game_intro] = gameState.intro;
  const [name, set_name] = useState(game_name);
  const [intro, set_intro] = useState(game_intro);
  useEffect(() => {
    set_name(game_name);
    set_intro(game_intro);
  }, [game_name, game_intro]);

  return (
    <div className="flex flex-col w-full h-full gap-5 bg-nr-main text-green-nr">
      <Input
        label="Game Name:"
        name="description"
        autoFocus
        value={name}
        onChange={(e) => {
          set_name(e.target.value);
          set_game_name(e.target.value);
        }}
      />
      <Input
        label="Game Introduction:"
        name="text"
        multiline
        value={intro}
        onChange={(e) => {
          set_intro(e.target.value);
          set_game_intro(e.target.value);
        }}
      />
      <div className="flex flex-row gap-5">
        <Input
          className="self-center flex-1"
          label="Destination:"
          name="path"
          value={game_folder}
          disabled
          onChange={() => null}
        />
        <Button
          type={ButtonType.BUTTON}
          className="self-end"
          onClick={async () => {
            // if (!game_folder) {
              const home_folder: string = await invoke('get_home_folder');
              const project_folder = await open({
                directory: true,
                multiple: false,
                title: 'Select Game Destination',
                defaultPath: home_folder,
              });
              if (project_folder && !Array.isArray(project_folder)) {
                set_game_folder(project_folder);
              }
            }
          }
        >
          Seletc Destination
        </Button>
      </div>
    </div>
  );
}
