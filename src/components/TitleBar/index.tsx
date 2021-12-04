import React, { useState } from 'react';
import { MinimizeButton } from './MinimizeButton';
import { MaximizeButton } from './MaximizeButton';
import { RestoreButton } from './RestoreButton';
import { CloseButton } from './CloseButton';
import './TitleBar.css';
import PropTypes from 'prop-types';

export default function TitleBar({ title }: { title: string }) {
  const [isMaximized, setIsMaximized] = useState(false);
  return (
    <div>
      <div data-tauri-drag-region className="titlebar">
        <div data-tauri-drag-region className="title">
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
