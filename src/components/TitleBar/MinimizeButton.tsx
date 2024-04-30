import './TitleBar.css';

import { getCurrent } from '@tauri-apps/api/window';

export const MinimizeButton = () => {
  return (
    <div
      className="titlebar_button"
      onClick={() => {
        const appWindow = getCurrent();
        appWindow.minimize()
      }}
      id="titlebar-minimize"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 32 32"
      >
        <path d="M27.223 27.223H4.777V4.777h11.707V1H1v30h30V15.516h-3.777z" />
        <path
          d="M14.111 6.775v11.113h11.114v-3.776h-4.666l10.23-10.23-2.671-2.671-10.23
        10.23V6.775z"
        />
      </svg>
    </div>
  );
};
