import './TitleBar.css';

import { getCurrent } from '@tauri-apps/api/window';

export const CloseButton = () => {
  return (
    <div
      className="titlebar_button titlebar_button_close"
      onClick={() => {
        const appWindow = getCurrent();
        appWindow.close()
      }}
      id="titlebar-close"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 512.001 512.001"
      >
        <path
          d="M512.001 84.853L427.148 0 256.001 171.147 84.853 0 0 84.853 171.148
        256 0 427.148l84.853 84.853 171.148-171.147 171.147 171.147
        84.853-84.853L340.853 256z"
        />
      </svg>
    </div>
  );
};
