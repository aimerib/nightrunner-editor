import './Input.css';

import { ChangeEventHandler, FC, RefObject as Ref } from 'react';

type ComponentProps = {
  multiline?: boolean;
  autoFocus?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  innerRef?: Ref<HTMLInputElement & HTMLTextAreaElement>;
  value: string;
  name: string;
  label: string;
  disabled?: boolean;
  className?: string;
  helperText?: string;
};

interface InputProps extends ComponentProps {
  fieldType?: 'input';
  type?: 'text' | 'number' | 'email' | 'phone';
}

interface TextAreaProps extends ComponentProps {
  fieldType?: 'textarea';
  cols?: number;
  rows?: number;
}

const Input: FC<InputProps | TextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  autoFocus,
  multiline,
  innerRef,
  disabled,
  className,
  helperText,
}): JSX.Element => {
  return (
    <div
      className={`flex flex-col text-xl font-bold${multiline ? ' h-full' : ''
        } ${className ? className : ''}`}
    >
      {label && (
        <div className="flex pb-2">
          <label className="self-center" htmlFor={name}>
            {label}
          </label>
          {helperText && (
            <div
              style={{
                height: 'max-content',
                padding: '0 7px',
                borderRadius: '50%',
              }}
              data-text={helperText}
              className="tooltip"
            >
              ?
            </div>
          )}
        </div>
      )}
      {multiline ? (
        <textarea
          style={{
            boxSizing: 'border-box',
            width: '100%',
            height: '100%',
            resize: 'none',
            fontFamily: 'monospace, monospace',
          }}
          disabled={disabled}
          name={name}
          className="input_style"
          autoFocus={autoFocus}
          ref={innerRef}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          disabled={disabled}
          name={name}
          className="input_style"
          autoFocus={autoFocus}
          ref={innerRef}
          type="text"
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

Input.displayName = 'Input';

export default Input;
