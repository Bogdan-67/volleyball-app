import { FC, useEffect, useState } from 'react';
import Select from 'react-select';
import { Option } from './ActionModal';

interface ConditionsSelectBarProps {
  data: string[];
  selected: Option;
  setSelected: (selected: Option) => void;
}

const ConditionsSelectBar: FC<ConditionsSelectBarProps> = ({ data, selected, setSelected }) => {
  const [options, setOptions] = useState(data.map((option) => ({ value: option, label: option })));
  const [value, setValue] = useState<Option>(null);

  useEffect(() => {
    setOptions(data.map((option) => ({ value: option, label: option })));
  }, [data]);

  const handleChange = (selectedOption: Option) => {
    setValue(selectedOption);
    setSelected(selectedOption);
  };

  return (
    <>
      <Select
        className='basic-single'
        classNamePrefix='select'
        key={`my_unique_select_key__${selected}`}
        value={selected}
        placeholder='Выберите условие'
        noOptionsMessage={() => 'Нет условий'}
        getOptionLabel={(e: Option) => e.label}
        getOptionValue={(e: Option) => e.value}
        name='condition'
        options={options}
        onChange={(e) => handleChange(e)}
      />
    </>
  );
};

export default ConditionsSelectBar;
