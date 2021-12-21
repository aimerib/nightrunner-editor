import React, { useState, useRef, useEffect } from 'react';
import { MinimizeButton } from './MinimizeButton';
import { MaximizeButton } from './MaximizeButton';
import { RestoreButton } from './RestoreButton';
import { CloseButton } from './CloseButton';
import './TitleBar.css';
import { FileMenu } from './FileMenu';

export default function TitleBar({ title }: { title: string }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFileMenuActive, setIsFileMenuActive] = useState(false);
  const subMenuRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        subMenuRef.current &&
        !subMenuRef.current.contains(event.target) &&
        !menuRef.current.contains(event.target)
      ) {
        setIsFileMenuActive(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [subMenuRef, menuRef]);

  return (
    <div className="titlebar">
      <div data-tauri-drag-region className="titlebar-top">
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
      <div
        ref={menuRef}
        className={`${isFileMenuActive ? 'menu_background' : ''} app_menu`}
        onClick={() => setIsFileMenuActive(!isFileMenuActive)}
      >
        File
      </div>
      <FileMenu innerRef={subMenuRef} active={isFileMenuActive} />
    </div>
  );
}
