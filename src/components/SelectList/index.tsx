/* eslint-disable no-nested-ternary */
import React from 'react';
import Select, { components } from 'react-select';

const ValueContainer = (props) => {
  const {
    isFocused,
    selectProps: { placeholder },
    children,
  }: {
    isFocused: boolean;
    selectProps: { placeholder: string };
    children: JSX.Element;
  } = props;
  return (
    <components.ValueContainer {...props}>
      <components.Placeholder {...props} isFocused={isFocused}>
        {placeholder}
      </components.Placeholder>
      {React.Children.map(children, (child) => {
        if (child && child.type !== components.Placeholder) {
          return child;
        }
        return null;
      })}
    </components.ValueContainer>
  );
};

const nrStyle = {
  noOptionsMessage: (styles) => ({
    ...styles,
    color: '#39ff14',
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none',
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: '#39ff14',
    ':hover': {
      backgroundColor: 'rgb(57, 255, 20)',
      color: '#111',
    },
  }),
  control: (styles) => ({
    ...styles,
    ':hover': {
      ...styles[':hover'],
      borderRadius: '0px',
      outline: '2px solid transparent',
      outlineOffset: '2px',
      boxShadow: `rgb(57, 255, 20) 0px 0px 0px 0px,
  rgb(57, 255, 20) 0px 0px 0px 2px,
  rgba(57, 255, 20, 1) 0px 0px 0px 0px`,
      borderWidth: '1px',
      borderColor: '#39ff14',
    },
    padding: '0.4rem',
    backgroundColor: 'rgba(25, 25, 25, 1);',
    borderColor: 'transparent',
    color: '#39ff14',
    borderRadius: '4px',
    borderBottom: '1px solid #3e3e3e',
    boxShadow:
      'inset 0 1px 2px rgba(0, 0, 0, 0.39), 0 -1px 1px #393939, 0 1px 0 #393939',
  }),
  menuList: (styles) => ({
    ...styles,
    backgroundColor: 'rgba(25, 25, 25, 1);',
  }),
  menu: (styles) => ({
    ...styles,
    boxShadow: '0 0 0 4px hsla(0, 0%, 0%, 0.1),0 12px 5px hsla(0, 0%, 0%, 0.1)',
    marginTop: '4px',
  }),
  option: (styles, { isDisabled, isFocused, isSelected, isMulti }) => {
    return {
      ...styles,
      color: isFocused || isSelected ? '#111111' : '#39ff14',
      backgroundColor: isDisabled
        ? undefined
        : isSelected && isMulti
        ? '#39ff14'
        : isSelected
        ? '#39ff14'
        : isFocused
        ? '#39ff14'
        : undefined,
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: '#39ff14',
        color: isSelected && 'black',
      },
    };
  },
  container: (styles) => ({
    ...styles,
    marginTop: '1.25rem',
  }),
  valueContainer: (styles) => ({
    ...styles,
    overflow: 'visible',
  }),
  placeholder: (styles, state) => ({
    ...styles,
    color: '#39ff14',
    position: 'absolute',
    top: state.hasValue || state.selectProps.inputValue ? -33 : '10%',
    left:
      state.hasValue || state.selectProps.inputValue
        ? state.isMulti
          ? -7
          : -16
        : '0%',
  }),
  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor: 'rgb(57, 255, 20)',
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: '#111111',
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: '#111',
    ':hover': {
      backgroundColor: '#111',
      color: 'rgb(57, 255, 20)',
    },
  }),
  clearIndicator: (styles) => ({
    ...styles,
    color: 'rgb(57, 255, 20)',
    ':hover': {
      backgroundColor: 'rgb(57, 255, 20)',
      color: '#111',
    },
  }),
  singleValue: (styles) => ({
    ...styles,
    color: '#39ff14',
  }),
};

interface OptionType {
  value: string | number;
  label: string;
}
type OptionsType = OptionType[];

type SelectListProps<IsMulti extends boolean> = {
  options: OptionsType;
  onChange: (option) => void;
  value?: OptionType | OptionType[];
  isMulti?: IsMulti;
  label?: string;
  isDisabled?: boolean;
};

export default function SelectList<IsMulti extends boolean>({
  options,
  label,
  value,
  isMulti,
  isDisabled,
  ...props
}: SelectListProps<IsMulti>) {
  return (
    <Select
      isDisabled={isDisabled}
      components={{ ValueContainer }}
      isMulti={isMulti}
      placeholder={label}
      closeMenuOnSelect={!isMulti}
      options={options}
      styles={nrStyle}
      value={value}
      {...props}
    />
  );
}
