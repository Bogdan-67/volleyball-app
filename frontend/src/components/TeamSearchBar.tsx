import React, { FC } from 'react';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';
import TrainService from '../services/TrainService';
import { Option } from './ActionModal';

type Props = {
  setTeam: (value) => void;
};

const TeamSearchBar: FC<Props> = ({ setTeam }) => {
  //get animated components wrapper
  const animatedComponents = makeAnimated();

  const fetchTeams = async () => {
    try {
      const fetch = await TrainService.getTeams();

      return fetch.data;
    } catch (error) {
      return [];
    }
  };

  // fetch filteres search results for dropdown
  const loadOptions = (inputValue: string, callback) => {
    fetchTeams().then((data) => {
      const filtered = data.filter((item) => item.includes(inputValue));

      const res = filtered.map((team) => {
        const obj = { value: team, label: team };
        return obj;
      });

      callback(res);
    });
  };

  return (
    <>
      <AsyncSelect
        cacheOptions
        placeholder='Выберите команду'
        noOptionsMessage={() => 'Команда не найдена'}
        defaultOptions
        isClearable={false}
        components={animatedComponents}
        getOptionLabel={(e: Option) => e.label}
        getOptionValue={(e: Option) => e.value}
        loadOptions={loadOptions}
        onChange={(selected: Option) => setTeam(selected)}
      />
    </>
  );
};

export default TeamSearchBar;
