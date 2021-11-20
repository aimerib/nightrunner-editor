import React from 'react';
import PropTypes from 'prop-types';
import styles from './button.module.css';
export default function Button({
  children,
  onClick,
  className,
  type,
  disabled,
}) {
  const run_callback_with_delay = (e) => {
    setTimeout(() => onClick(), 200);
    e.preventDefault();
  };
  if (onClick) {
    return (
      <button
        disabled={disabled}
        className={`${
          disabled ? styles.disabled_button : styles.button
        } ${className} ${disabled ? '' : 'hover:text-glow-sm'}`}
        type={type === 'submit' ? 'submit' : 'button'}
        onClick={run_callback_with_delay}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      disabled={disabled}
      className={`${
        disabled ? styles.disabled_button : styles.button
      } ${className} ${disabled ? '' : 'hover:text-glow-sm'}`}
      type={type === 'submit' ? 'submit' : 'button'}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  className: '',
  type: '',
};

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};
