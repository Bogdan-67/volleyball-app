import React, { useState } from 'react';
import styles from './StatTile.module.scss';
import ProgressCircle from '../ProgressCircle';
import { AnimatePresence, motion } from 'framer-motion';

const circlesNames = {
  inning: 'Подача',
  blocks: 'Блок',
  attacks: 'Атака',
  catch: 'Прием',
  defence: 'Защита',
  support: 'Передача',
};

export const StatTile = ({ name, winCount, lossCount, stat }) => {
  const [expand, setExpand] = useState<boolean>(false);

  const expandVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.4,
      },
    },
    show: {
      height: 'auto',
      opacity: 1,
    },
  };

  return (
    <AnimatePresence mode='wait'>
      <div
        className={styles.tile}
        onMouseEnter={() => setExpand(true)}
        onMouseLeave={() => setExpand(false)}>
        <div className={styles.tile__info}>
          <p className={styles.tile__info__text}>{circlesNames[name]}</p>
          <AnimatePresence>
            {expand && (
              <motion.div
                variants={expandVariants}
                initial='hidden'
                animate='show'
                exit='hidden'
                transition={{ duration: 0.3 }}
                layoutId={circlesNames[name]}
                className={styles.tile__info__expand}>
                <p className={styles.tile__info__expand__count}>Выиграно: {winCount}</p>
                <p className={styles.tile__info__expand__count}>Проиграно: {lossCount}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ProgressCircle progress={stat * 100} />
      </div>
    </AnimatePresence>
  );
};

export default StatTile;
