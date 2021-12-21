import React from 'react';
import { open } from '@tauri-apps/api/dialog';

interface Props {
  active: boolean;
  innerRef: React.RefObject<HTMLDivElement>;
}

const handleNewProject = async () => {
  const name = await open({
    directory: true,
    multiple: false,
  });
};

export const FileMenu = ({ active, innerRef }: Props) => {
  return (
    <div
      ref={innerRef}
      className={`${
        active ? 'visible' : 'hidden'
      } z-50 absolute bg-gray-900 text-green-nr w-1/12 menu_area menu_background`}
    >
      <a className="menu_item">New Game</a>
    </div>
  );
};
