import { FC } from 'react';
import styles from './Loading.module.scss';

const Loading: FC = () => {
  return <div className={styles.loading}>Загрузка...</div>;
};

export default Loading;
