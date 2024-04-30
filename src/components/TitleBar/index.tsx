import './TitleBar.css';

import { useEffect, useRef, useState } from 'react';

import { CloseButton } from './CloseButton';
import { FileMenu } from './FileMenu';
import { MaximizeButton } from './MaximizeButton';
import { MinimizeButton } from './MinimizeButton';
import { RestoreButton } from './RestoreButton';

export default function TitleBar({ title }: { title: string }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFileMenuActive, setIsFileMenuActive] = useState(false);

  const subMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        !subMenuRef.current?.contains(event.target as Node) &&
        !menuRef.current?.contains(event.target as Node)
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
      <div data-tauri-drag-region className="titlebar_top">
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
        className={`${isFileMenuActive ? 'menu_background' : ''} ${'app_menu'
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
