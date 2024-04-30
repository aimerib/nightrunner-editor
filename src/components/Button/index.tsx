import './Button.css';

import React from 'react';

import { ButtonType } from '../../types';

export default function Button({
  children,
  onClick,
  className,
  type,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: ButtonType;
  disabled?: boolean;
}) {
  const run_callback_with_delay = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTimeout(() => onClick && onClick(), 200);
    e.preventDefault();
  };
  if (onClick) {
    return (
      <button
        disabled={disabled}
        className={`${disabled ? 'disabled_button' : 'button'
          } ${className} text-2.5xl`}
        type={type === ButtonType.SUBMIT ? 'submit' : 'button'}
        onClick={run_callback_with_delay}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      disabled={disabled}
      className={`${disabled ? 'disabled_button' : 'button'
        } ${className} text-2.5xl`}
      type={type === ButtonType.SUBMIT ? 'submit' : 'button'}
    >
      {children}
    </button>
  );
}
