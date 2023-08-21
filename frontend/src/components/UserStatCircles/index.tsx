import React, { useEffect, useState, FC, useRef } from 'react';
import styles from './UserStatCircles.module.scss';
import UserService from '../../services/UserService';
import { ITrain } from '../../models/ITrain';
import StatTile from '../StatTile';
import StatTileSkeleton from '../StatTileSkeleton';

interface UserStatCirclesProps {
  user: number;
}

const UserStatCircles: FC<UserStatCirclesProps> = ({ user }) => {
  const [error, setError] = useState<string>(null);
  const [stat, setStat] = useState<ITrain>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStat = async (user: number) => {
    setIsLoading(true);
    await UserService.fetchUserStat(user)
      .then((res) => {
        setStat(res.data);
        setError(null);
      })
      .catch((error) => {
        setError(
          error.response?.data?.message
            ? error.response?.data?.message
            : 'Не удалось получить статистику',
        );
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (user) {
      fetchStat(user);
    }
  }, []);
  const skeletons = [...new Array(6)].map((item) => <StatTileSkeleton />);

  return (
    <section className={styles.root}>
      <h2 className={styles.root__title}>Статистика тренировок</h2>

      <div className={styles.root__content}>
        {isLoading ? (
          skeletons.map((skeleton) => skeleton)
        ) : error || !stat ? (
          <div className={styles.error}>
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
      </div>
    </section>
  );
};

export default UserStatCircles;
