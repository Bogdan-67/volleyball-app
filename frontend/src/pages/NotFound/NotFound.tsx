import React from 'react';
import styles from './notFound.module.scss';
import { motion } from 'framer-motion';
import pageMotion from '../../components/pageMotion';

export const NotFound = () => {
  return (
    <motion.div variants={pageMotion} initial='hidden' animate='show' exit='exit'>
      <div className={styles.notFound}>
        <span className={styles.notFound__404}>404</span>
        <div className={styles.notFound__error}>
          <span>😕</span>
          Такой страницы не существует
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;
