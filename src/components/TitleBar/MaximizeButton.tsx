import './TitleBar.css';

import { getCurrent } from '@tauri-apps/api/window';

export const MaximizeButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className="titlebar_button"
      onClick={() => {
        const appWindow = getCurrent();
        appWindow.maximize();
        onClick();
      }}
      id="titlebar-maximize"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 512 512"
      >
        <path
          fillRule="evenodd"
          d="M221.5 176.384l-93.065-93.066 34.025-34.025a8.738 8.738 0
        00-4.2-14.689L85.319 17.615 10.736.244a8.522 8.522 0 00-8.161
        2.331 8.522 8.522 0 00-2.331 8.161L17.615 85.32 34.6 158.263a8.738
        8.738 0 0014.689 4.2l34.024-34.024 93.071 93.061a6.873 6.873 0
        009.7 0l35.416-35.413a6.875 6.875 0 000-9.7zm69 0l93.067-93.066-34.027-34.025a8.738
        8.738 0 014.2-14.689l72.944-16.989L501.264.244a8.522 8.522 0 018.161
        2.331 8.522 8.522 0 012.331 8.161L494.385 85.32 477.4 158.263a8.738
        8.738 0 01-14.689 4.2l-34.024-34.024-93.071 93.061a6.873 6.873 0 01-9.7
        0L290.5 186.087a6.875 6.875 0 010-9.7zm0 159.232l93.067 93.066-34.027 34.025a8.738
        8.738 0 004.2 14.689l72.944 16.989 74.583 17.371a8.737 8.737 0
        0010.492-10.492l-17.374-74.584-16.985-72.943a8.738 8.738 0 00-14.689-4.2l-34.024
        34.024-93.071-93.061a6.873 6.873 0 00-9.7 0L290.5 325.913a6.875 6.875 0 000 9.7zm-69
        0l-93.067 93.066 34.025 34.025a8.738 8.738 0 01-4.2 14.689l-72.939 16.989-74.583
        17.371a8.522 8.522 0 01-8.161-2.331 8.522 8.522 0 01-2.331-8.161l17.371-74.584L34.6
        353.737a8.738 8.738 0 0114.689-4.2l34.024 34.024 93.071-93.061a6.873 6.873 0 019.7
        0l35.416 35.413a6.875 6.875 0 010 9.703z"
        />
      </svg>
    </div>
  );
};
