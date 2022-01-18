import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, ListContainer } from '../../components';
import { store } from '../../store';
import { ButtonType } from '../../types';
import { useFocus } from '../../utils';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';

export default function Settings() {
  const { gameState } = useContext(store);
  const [game_folder, set_game_folder] = gameState.folder;
  const game_name = gameState.name[0];
  const game_intro = gameState.intro[0];
  const save_settings = useContext(store).save_settings;
  const [name, set_name] = useState(game_name);
  const [intro, set_intro] = useState(game_intro);
  const [inputRef, setInputFocus] = useFocus();
  useEffect(() => {
    if (!name) {
      setInputFocus();
    }
    if (name !== game_name || intro !== game_intro) {
      save_settings(name, intro);
    }
  }, [name, intro]);
  // const handle_save = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!game_folder) {
  //     const home_folder: string = await invoke('get_home_folder');
  //     const project_folder = await open({
  //       directory: true,
  //       multiple: false,
  //       defaultPath: home_folder,
  //     });
  //     if (project_folder && !Array.isArray(project_folder)) {
  //       set_game_folder(project_folder);
  //     }
  //   }
  //   if (name && intro) {
  //     save_settings(name, intro);
  //   }
  // };
  return (
    <div
      // onSubmit={handle_save}
      className="flex flex-col w-full h-full gap-5 bg-nr-main text-green-nr"
    >
      <Input
        label="Game Name:"
        name="description"
        autoFocus
        value={game_name}
        onChange={(e) => set_name(e.target.value)}
        innerRef={inputRef}
      />
      <Input
        label="Game Introduction:"
        name="text"
        multiline
        value={game_intro}
        onChange={(e) => {
          set_intro(e.target.value);
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
            if (!game_folder) {
              const home_folder: string = await invoke('get_home_folder');
              const project_folder = await open({
                directory: true,
                multiple: false,
                defaultPath: home_folder,
              });
              if (project_folder && !Array.isArray(project_folder)) {
                set_game_folder(project_folder);
              }
            }
          }}
        >
          Seletc Destination
        </Button>
      </div>
    </div>
  );
}
