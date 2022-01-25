import React, { useState, useRef, useEffect } from 'react';
import { MinimizeButton } from './MinimizeButton';
import { MaximizeButton } from './MaximizeButton';
import { RestoreButton } from './RestoreButton';
import { CloseButton } from './CloseButton';
import title_bar from './title_bar.module.css';
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
    <div className={title_bar.titlebar}>
      <div data-tauri-drag-region className={title_bar.titlebar_top}>
        <div data-tauri-drag-region className={title_bar.title}>
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
        className={`${isFileMenuActive ? title_bar.menu_background : ''} ${
          title_bar.app_menu
        }`}
        onClick={() => setIsFileMenuActive(!isFileMenuActive)}
      >
        File
      </div>
      <FileMenu
        innerRef={subMenuRef}
        active={isFileMenuActive}
        setActive={setIsFileMenuActive}
      />
    </div>
  );
}
