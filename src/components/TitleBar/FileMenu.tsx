import React, { useContext } from 'react';
// import { open } from '@tauri-apps/api/dialog';
// import { notification } from '@tauri-apps/api';
import { store } from '../../store';

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

// const notify = () => {
//   const message = {
//     title: 'Nightrunner Editor',
//     body: 'New game created',
//     icon: '',
//   };
//   if (notification.isPermissionGranted) {
//     notification.sendNotification(message);
//   } else {
//     notification.requestPermission().then((permission) => {
//       if (permission) {
//         notification.sendNotification(message);
//       } else {
//         console.error('Permission not granted');
//       }
//     });
//   }
// };

export const FileMenu = ({ active, innerRef, setActive }: Props) => {
  const { new_game } = useContext(store);

  return (
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
          new_game();
        }}
      >
        New Game
      </a>
    </div>
  );
};
