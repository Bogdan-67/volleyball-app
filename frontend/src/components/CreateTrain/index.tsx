import { FC, useEffect, useState } from 'react';
import styles from './CreateTrain.module.scss';
import { useAppDispatch } from '../../redux/store';
import { useSelector } from 'react-redux';
import {
  SelectCreateTrain,
  setPlayers,
  setSelectedTeam,
} from '../../redux/slices/createTrainSlice';
import { SelectAccountID } from '../../redux/slices/profileSlice';
import {
  SelectTrainPlayers,
  SelectTrainStatus,
  postNewTrain,
  setDate,
  setTeam,
} from '../../redux/slices/trainSlice';
import { useNavigate } from 'react-router';
import classNames from 'classnames';
import UserSearchBar from '../UserSearchBar';
import { ISelectUser } from '../../models/ISelectUser';
import TrainService from '../../services/TrainService';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import qs from 'qs';
import { motion } from 'framer-motion';
import pageMotion from '../pageMotion';

const CreateTrain: FC = () => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [teamIsValid, setTeamIsValid] = useState<boolean>(false);
  const [teamValue, setTeamValue] = useState<string>('');
  const { selectPlayers, team } = useSelector(SelectCreateTrain);
  const players = useSelector(SelectTrainPlayers);
  const account_id = useSelector(SelectAccountID);
  const status = useSelector(SelectTrainStatus);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [collabs, setCollabs] = useState<ISelectUser[]>([]);

  useEffect(() => {
    const players: number[] = collabs.map((obj) => obj.id_account);
    dispatch(setPlayers(players));
  }, [collabs]);

  useEffect(() => {
    if (!teamIsValid || collabs.length === 0) setIsValid(false);
    else setIsValid(true);
  }, [collabs, teamIsValid]);

  const onChangeTeamInput = async (value: string) => {
    setTeamValue(value);
    dispatch(setSelectedTeam(value));
    if (value) {
      const valid = await TrainService.checkTeam(value);

      if (valid.data) setTeamIsValid(true);
      else setTeamIsValid(false);
    } else setTeamIsValid(false);
  };

  const createTrain = (account_id: number, team: string, selectPlayers: number[]) => {
    dispatch(postNewTrain({ account_id, team, selectPlayers }));
    dispatch(setTeam(team));
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    dispatch(setDate(formattedDate));
    const queryString = qs.stringify({
      team: team,
      date: formattedDate,
    });
    navigate(`/training?${queryString}`);
  };

  return (
    <motion.div
      variants={pageMotion}
      initial='hidden'
      animate='show'
      exit='exit'
      className={styles.train}>
      <h2 className={styles.train__title}>Создание тренировки</h2>
      <div className={styles.train__elem}>
        <p>Название команды:</p>
        <div className={styles.train__team}>
          <input
            className={classNames({ [styles.train__team_notValid]: !teamIsValid && teamValue })}
            value={teamValue}
            onChange={(event) => onChangeTeamInput(event.target.value)}
            type='text'
          />
          {!teamIsValid && teamValue && <span>У этой группы сегодня уже есть тренировка</span>}
          {!teamIsValid && teamValue && (
            <FaTimesCircle
              className={classNames(styles.train__checkIcon, styles.train__checkIcon_false)}
            />
          )}
          {teamIsValid && teamValue && (
            <FaCheckCircle
              className={classNames(styles.train__checkIcon, styles.train__checkIcon_true)}
            />
          )}
        </div>
      </div>
      <div className={styles.train__elem}>
        <p>Игроки:</p>
        <UserSearchBar setCollabs={setCollabs} isMulti={true} isClearable={true} />
      </div>
      <button
        className={classNames(styles.train__create, {
          [styles.train__create_notValid]: !isValid,
        })}
        disabled={!isValid}
        onClick={() => createTrain(account_id, team, selectPlayers)}>
        Создать
      </button>
    </motion.div>
  );
};

export default CreateTrain;
