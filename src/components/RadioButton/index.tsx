import './RadioButton.css';
import React from 'react';

export default function RadioButton({
  value,
  checked,
  name,
  id,
  children,
  onChange,
  disabled,
}: {
  value: string;
  checked: boolean;
  name: string;
  id: string;
  children: React.ReactNode;
  onChange: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div
      key={id}
      className={`flex pl-3 py-1 ${
        checked
          ? 'bg-nr-active text-black '
          : 'hover:bg-nr-600 hover:text-green-nr'
      } `}
      onChange={disabled ? null : onChange}
      onClick={disabled ? null : onChange}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        className="hide_radio"
      />
      <label className={'flex-1 truncate'} htmlFor={id}>
        {children}
      </label>
    </div>
  );
}
