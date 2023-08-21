import { useState, FC, useEffect } from 'react';
import styles from './UserTrainings.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import UserService from '../../services/UserService';
import { useAppSelector } from '../../hooks/redux';
import { SelectAccountID } from '../../redux/slices/profileSlice';
import { ITrain } from '../../models/ITrain';
import Pagination from '../Pagination';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { FaStar } from 'react-icons/fa';
import classNames from 'classnames';
import Modal from '../Modal';
import TrainCardSkeleton from '../TrainCardSkeleton';
import { useNavigate } from 'react-router';
import { dateConvertToIso } from '../../pages/Statistics';

type UserTrain = ITrain & {
  day_team: string;
  date: string;
};

export interface UserTrains {
  count: number;
  rows: UserTrain[];
}

export const limitVariants = [4, 8, 12, 16];

export const UserTrainings: FC = () => {
  const id = useAppSelector(SelectAccountID);
  const [trains, setTrains] = useState<UserTrains>({ count: 0, rows: [] });
  const [error, setError] = useState<string>(null);
  const [limit, setLimit] = useState<number>(8);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const fetchTrains = async () => {
    if (id) {
      setIsLoading(true);
      await UserService.fetchUserTrains(id, page, limit)
        .then((res) => {
          setIsLoading(false);
          setError(null);
          setTrains(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setError(
            err.response.data.message
              ? err.response.data.message
              : 'Не удалось получить тренировки',
          );
        });
    }
  };

  useEffect(() => {
    fetchTrains();
  }, [page, limit]);

  const scrollToTop = () => {
    const rootElement = document.getElementById('trainings'); // Замените 'root' на ID родительского элемента компонента
    const headerElement = document.getElementById('header'); // Замените 'header' на ID вашего заголовка
    console.log(rootElement);
    console.log(headerElement);

    if (rootElement && headerElement) {
      const headerHeight = headerElement.offsetHeight;
      const rootTopOffset = rootElement.offsetTop - headerHeight - 15;

      window.scrollTo({
        top: rootTopOffset,
        behavior: 'smooth',
      });

      console.log('SCROLL');
    } else console.log('not scroll');
  };

  const handlePageClick = (selected: number) => {
    setPage(selected);
    scrollToTop();
  };

  const skeletons = [...new Array(limit)].map(() => <TrainCardSkeleton />);
  console.log(skeletons);

  return (
    <section className={styles.root} id='trainings'>
      <h2 className={styles.root__title}>Мои тренировки</h2>
      <div className={styles.root__content}>
        {isLoading ? (
          <ul className={styles.container}>
            {skeletons.map((skeleton) => (
              <li>{skeleton}</li>
            ))}
          </ul>
        ) : error ? (
          <div className={styles.error}>
            <span>😕</span>
            {error}
          </div>
        ) : trains.rows.length === 0 ? (
          <div className={styles.root__content__empty}>У вас пока не было тренировок</div>
        ) : (
          <>
            <AnimatePresence>
              <motion.ul
                className={styles.container}
                variants={container}
                initial='hidden'
                animate='visible'>
                {trains.rows.map((train) => {
                  return (
                    <motion.li
                      key={train.id_train}
                      className={styles.item}
                      variants={item}
                      onClick={() => {
                        navigate(`/my-training?id_train=${train.id_train}&account_id=${id}`);
                      }}>
                      <div className={styles.item__content}>
                        <div className={styles.item__team}>{train.day_team}</div>
                        <div className={styles.item__separator}></div>
                        <div className={styles.item__date}>
                          {dateConvertToIso(new Date(train.date)).split('-').reverse().join('.')}
                        </div>
                        <div className={styles.item__rating}>
                          {' '}
                          <FaStar /> 5.0
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </AnimatePresence>
            {limit !== trains.count && limit < trains.count && (
              <>
                <Pagination
                  page={page}
                  pageCount={Math.ceil(trains.count / limit)}
                  handlePageClick={handlePageClick}
                />
                <div className={styles.showNum}>
                  <p>Показывать на странице:</p>
                  {limitVariants.map((item, i) => (
                    <span
                      key={i}
                      className={classNames(styles.showNum__item, {
                        [styles.showNum__item_active]: item === limit,
                      })}
                      onClick={() => {
                        setPage(1);
                        setLimit(item);
                      }}>
                      {item}
                    </span>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default UserTrainings;
