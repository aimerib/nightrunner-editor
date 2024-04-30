import React from 'react';
import style from './topBar.module.css';

interface TopBarProps {
  onAddRoom: () => void;
  onRemoveRoom: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onAddRoom, onRemoveRoom }) => {
  return (
    <div className={style.top_bar}>
      <button type="button" className={style.top_bar_button} onClick={onAddRoom}>
        Add Room
      </button>
      <button type="button" className={style.top_bar_button} onClick={onRemoveRoom}>
        Remove Room
      </button>
    </div>
  );
};

export default TopBar;
