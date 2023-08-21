import React, { FC } from 'react';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';
import $api from '../http';
import { ISelectUser } from '../models/ISelectUser';
import { useSelector } from 'react-redux';
import { SelectAccountID } from '../redux/slices/profileSlice';

type Props = {
  setCollabs: (value) => void;
  isMulti: boolean;
  isClearable: boolean;
  filter?: number[];
};

type Player = {
  player: string;
  player_id: number;
};

const UserSearchBar: FC<Props> = ({ setCollabs, isMulti, isClearable, filter }) => {
  const myId = useSelector(SelectAccountID);
  //get animated components wrapper
  const animatedComponents = makeAnimated();
  if (!filter) filter = [];

  const fetchUsers = async () => {
    try {
      const fetch = await $api.get<ISelectUser[]>('/select-users');

      return fetch.data;
    } catch (error) {
      return [];
    }
  };

  // fetch filteres search results for dropdown
  const loadOptions = (inputValue: string, callback) => {
    fetchUsers().then((data) => {
      const users = data
        // .filter((player) => player.id_account !== myId)
        .map((obj) => {
          const player = {
            ...obj,
            player: obj.surname + ' ' + obj.name + ' ' + obj.patronimyc,
          };
          return player;
        });
      const res = users
        .filter((user) => !filter.includes(user.id_account))
        .filter((data) => data.player.includes(inputValue));

      callback(res);
    });
  };

  return (
    <>
      <AsyncSelect
        cacheOptions
        placeholder='Выберите участника'
        noOptionsMessage={() => 'Игрок не найден'}
        defaultOptions
        isClearable={isClearable}
        isMulti={isMulti}
        components={animatedComponents}
        getOptionLabel={(e: Player) => e.player}
        getOptionValue={(e: Player) => e.player}
        loadOptions={loadOptions}
        onChange={(value) => setCollabs(value)}
      />
    </>
  );
};

export default UserSearchBar;
