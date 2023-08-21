import React, { FC } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

type Props = {
  setSelected: (value) => void;
  isMulti: boolean;
  isClearable: boolean;
  placeholder: string;
  emptyMessage: string;
  options: Option[];
  disabled: boolean;
  value: Option | Option[];
};

export type Option = {
  label: string;
  value: any;
};

const SelectBar: FC<Props> = ({
  setSelected,
  value,
  isMulti,
  isClearable,
  placeholder,
  emptyMessage,
  options,
  disabled,
}) => {
  //get animated components wrapper
  const animatedComponents = makeAnimated();

  return (
    <>
      <Select
        placeholder={placeholder}
        noOptionsMessage={() => emptyMessage}
        isDisabled={disabled}
        isMulti={isMulti}
        isClearable={isClearable}
        components={animatedComponents}
        getOptionLabel={(e: Option) => e.label}
        getOptionValue={(e: Option) => e.value}
        onChange={(value) => setSelected(value)}
        options={options}
      />
    </>
  );
};

export default SelectBar;
