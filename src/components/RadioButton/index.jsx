import style from './radio.module.css';
import React from 'react';
import PropTypes from 'prop-types';

export default function RadioButton({
  value,
  checked,
  name,
  id,
  children,
  onChange,
  disabled,
}) {
  return (
    <div
      key={id}
      className={`flex pl-3 py-1 ${checked ? 'bg-nr-active text-black' : ''}`}
      onChange={disabled ? null : onChange}
      onClick={disabled ? null : onChange}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        className={style.hide_radio}
      />
      <label
        className={`flex-1 max-w-xl truncate ${
          disabled ? '' : 'cursor-pointer'
        }`}
        htmlFor={id}
      >
        {children}
      </label>
    </div>
  );
}

RadioButton.defaultProps = {
  onChange: () => null,
  checked: false,
};

RadioButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};
