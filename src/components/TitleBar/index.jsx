import React, { useState } from 'react';
import { MinimizeButton } from './MinimizeButton';
import { MaximizeButton } from './MaximizeButton';
import { RestoreButton } from './RestoreButton';
import { CloseButton } from './CloseButton';
import style from './titlebar.module.css';
import PropTypes from 'prop-types';

export default function TitleBar({ title }) {
  const [isMaximized, setIsMaximized] = useState(false);
  return (
    <div>
      <div data-tauri-drag-region className={style.titlebar}>
        <div data-tauri-drag-region className={style.title}>
          <p data-tauri-drag-region className="cursor-default">
            {title}
          </p>
        </div>
        <MinimizeButton />
        {isMaximized ? (
          <RestoreButton onClick={() => setIsMaximized(false)} />
        ) : (
          <MaximizeButton onClick={() => setIsMaximized(true)} />
        )}
        <CloseButton />
      </div>
    </div>
  );
}

TitleBar.defaultProps = {
  title: '',
};

TitleBar.propTypes = {
  title: PropTypes.string,
};
