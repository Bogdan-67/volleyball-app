import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { SelectAccountID, Status } from '../../redux/slices/profileSlice';
import { useLocation, useNavigate } from 'react-router';
import TrainService from '../../services/TrainService';
import { ITrain } from '../../models/ITrain';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { motion } from 'framer-motion';
import pageMotion from '../../components/pageMotion';
import styles from './UserTraining.module.scss';
import StatTile from '../../components/StatTile';
import UserService from '../../services/UserService';
import { IAction } from '../../models/IAction';
import { limitVariants } from '../TrainingEdit';
import classNames from 'classnames';
import ActionTile from '../../components/ActionTile';
import Pagination from '../../components/Pagination';
import StatTileSkeleton from '../../components/StatTileSkeleton';
import { dateConvertToIso } from '../Statistics';

export type UserTrain = {
  date: string;
  day_team: string;
  account_id: number;
  inning_stat: string;
  blocks_stat: string;
  attacks_stat: string;
  catch_stat: string;
  defence_stat: string;
  support_stat: string;
  id_train: number;
};

const UserTraining = () => {
  const [idTrain, setIdTrain] = useState<number>(null);
  const [idAccount, setIdAccount] = useState<number>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingStat, setIsLoadingStat] = useState<boolean>(true);
  const [statError, setStatError] = useState<string>(null);
  const [error, setError] = useState<string>(null);
  const [train, setTrain] = useState<UserTrain>(null);
  const [stat, setStat] = useState(null);
  const [actionsStatus, setActionsStatus] = useState<string>(Status.LOADING);
  const [actionsError, setActionsError] = useState<string>(null);
  const [actions, setActions] = useState<IAction[]>([]);
  const [actionsCount, setActionsCount] = useState<number>(0);
  // Стейты первого рендера
  const isSearch = React.useRef(false);
  const isMounted = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Пагинация действий
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);

  const fetchTrain = async () => {
    await TrainService.getOneTrain(idTrain, idAccount)
      .then((res) => {
        setTrain(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message
            ? err.response?.data?.message
            : 'Не удалось получить тренировку',
        );
      })
      .finally(() => setIsLoading(false));
  };

  const fetchStat = async () => {
    setIsLoadingStat(true);
    await UserService.fetchUserStat(idAccount, idTrain)
      .then((res) => {
        setIsLoadingStat(false);
        setStatError(null);
        setStat(res.data);
      })
      .catch((err) => {
        setIsLoadingStat(false);
        setStatError(
          err.response?.data?.message
            ? err.response?.data?.message
            : 'Не удалось получить статистику',
        );
      })
      .finally(() => setIsLoadingStat(false));
  };

  const fetchActions = async () => {
    setActionsStatus(Status.LOADING);
    await UserService.fetchUserTrainActions(idTrain, page, limit)
      .then((res) => {
        setActions(res.data.actions);
        setActionsCount(res.data.count);
        setActionsStatus(Status.SUCCESS);
        setActionsError(null);
      })
      .catch((err) => {
        setActionsStatus(Status.ERROR);
        setActionsError(
          err.response?.data?.message
            ? err.response?.data?.message
            : 'Не удалось получить действия',
        );
      });
  };

  useEffect(() => {
    if (
      !location.search ||
      !new URLSearchParams(location.search).get('id_train') ||
      !new URLSearchParams(location.search).get('account_id')
    )
      navigate('/');
    if (!isMounted.current) {
      setIdTrain(+new URLSearchParams(location.search).get('id_train'));
      setIdAccount(+new URLSearchParams(location.search).get('account_id'));
      isMounted.current = true;
    }
  }, []);

  useEffect(() => {
    if (idTrain && idAccount) {
      fetchTrain();
      fetchStat();
      fetchActions();
    }
  }, [idTrain, idAccount]);

  const handlePageClick = (selected: number) => {
    setPage(selected);
  };

  const onDeleteAction = async (id_action: number) => {
    if (window.confirm('Удалить действие?')) {
      await TrainService.deleteTrainAction(id_action);
    }
  };

  const statTileSkeletons = [...new Array(6)].map((item) => <StatTileSkeleton />);

  return (
    <motion.div variants={pageMotion} initial='hidden' animate='show' exit='exit'>
      <div className={styles.train}>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div>
            <span>😕</span>
            {error ? error : 'Не удалось получить тренировку'}
          </div>
        ) : (
          <>
            <button onClick={() => navigate(-1)} className={styles.train__backBtn}>
              {'<'}&nbsp; Вернуться назад
            </button>
            <h1 className={styles.train__title}>
              Тренировка: {dateConvertToIso(new Date(train.date)).split('-').reverse().join('.')}
            </h1>
            <h2 className={styles.train__team}>Команда: {train.day_team}</h2>
            <ul className={styles.train__stat}>
              {isLoadingStat ? (
                statTileSkeletons.map((skeleton) => skeleton)
              ) : error ? (
                <div>
                  <span>😕</span>
                  {error ? error : 'Не удалось получить статистику'}
                </div>
              ) : (
                Object.entries(stat).map((arr) => (
                  <>
                    <StatTile
                      name={arr[0]}
                      winCount={arr[1][arr[0] + '_winCount']}
                      lossCount={arr[1][arr[0] + '_lossCount']}
                      stat={arr[1][arr[0] + '_stat']}
                    />
                  </>
                ))
              )}
            </ul>
            <div className={styles.actions}>
              <h3 className={styles.actions__title}>Действия за тренировку</h3>
              {actionsStatus === Status.LOADING ? (
                <LoadingSpinner />
              ) : actionsStatus === Status.ERROR ? (
                <div className={styles.train__error}>
                  <span>😕</span>
                  {actionsError ? actionsError : 'Произошла ошибка'}
                </div>
              ) : (
                <motion.div transition={{ delayChildren: 0.5 }} className={styles.actions__list}>
                  {actions.length === 0 ? (
                    <div className={styles.actions__list__empty}>Действий пока нет</div>
                  ) : (
                    <>
                      <div className={styles.actions__showNum}>
                        <p>Показывать на странице:</p>
                        {limitVariants.map((item, i) => (
                          <span
                            key={i}
                            className={classNames(styles.actions__showNum__item, {
                              [styles.actions__showNum__item_active]: item === limit,
                            })}
                            onClick={() => {
                              setPage(1);
                              setLimit(item);
                            }}>
                            {item}
                          </span>
                        ))}
                      </div>
                      {actions.map((obj) => (
                        <ActionTile data={obj} onDeleteAction={onDeleteAction} />
                      ))}
                    </>
                  )}
                </motion.div>
              )}
              {limit !== actionsCount && limit < actionsCount && (
                <>
                  <div
                    className={styles.actions__showAll}
                    onClick={() => {
                      setLimit(actionsCount);
                      setPage(1);
                    }}>
                    Показать все
                  </div>{' '}
                  <Pagination
                    page={page}
                    pageCount={Math.ceil(actionsCount / limit)}
                    handlePageClick={handlePageClick}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default UserTraining;
