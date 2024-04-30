import './Checkbox.css';

import React from 'react';

type CheckboxProps = {
  label: string;
  value?: string;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  checked: boolean;
  className?: string;
  name?: string;
};

const Checkbox = ({
  label,
  value,
  onClick,
  checked,
  className = '',
  ...props
}: CheckboxProps): JSX.Element => {
  return (
    <div
      className={`flex py-1 justify-items-center ${className}`}
      onClick={onClick}
      {...props}
    >
      <label className="flex" htmlFor={label}>
        <div className="nr-input checkbox_container">
          <input
            type="checkbox"
            name={label}
            value={value}
            className="hide_checkbox"
          />
          <div className="self-center w-5 h-5 justify-self-center bg-nr-900">
            <svg
              viewBox="0 0 18 18"
              height="18px"
              width="18px"
              className={`${checked ? 'visible' : 'hidden'}`}
            >
              <path
                className="checkbox_icon"
                d="M 17.195312 1.171875 C 16.382812 0.734375 15.480469 1.574219 14.949219
                  2.074219 C 13.730469 3.261719 12.703125 4.632812 11.546875 5.882812 C
                  10.265625 7.253906 9.082031 8.628906 7.769531 9.972656 C 7.023438 10.71875
                  6.210938 11.53125 5.710938 12.46875 C 4.589844 11.375 3.621094 10.1875 2.371094
                  9.222656 C 1.46875 8.535156 -0.03125 8.035156 0 9.691406 C 0.0625 11.84375
                  1.964844 14.152344 3.371094 15.621094 C 3.964844 16.242188 4.742188 16.898438
                  5.648438 16.929688 C 6.742188 16.992188 7.863281 15.679688 8.519531 14.964844 C
                  9.675781 13.714844 10.609375 12.3125 11.671875 11.03125 C 13.046875 9.347656
                  14.449219 7.691406 15.792969 5.976562 C 16.632812 4.914062 19.285156 2.292969
                  17.195312 1.171875 Z M 1.375 9.566406 C 1.34375 9.566406 1.3125 9.566406 1.25
                  9.597656 C 1.125 9.566406 1.03125 9.535156 0.90625 9.472656 C 1 9.410156 1.15625
                  9.441406 1.375 9.566406 Z M 1.375 9.566406 "
              />
            </svg>
          </div>
        </div>
        <span className="ml-2 text-xl font-bold">{label}</span>
      </label>
    </div>
  );
};

export default Checkbox;
