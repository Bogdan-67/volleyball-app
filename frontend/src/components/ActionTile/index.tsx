import React from 'react';
import styles from './ActionTile.module.scss';
import classNames from 'classnames';
import { useAppSelector } from '../../hooks/redux';
import { SelectUserRole } from '../../redux/slices/profileSlice';

export const ActionTile = ({ data, onDeleteAction }) => {
  const role = useAppSelector(SelectUserRole);
  return (
    <div key={data.id_action} className={styles.actions__item}>
      <div className={styles.actions__item__time}>{data.time.split('').splice(0, 8).join('')}</div>
      <div
        className={classNames(styles.actions__item__status, {
          [styles.actions__item__status_win]: data.score === 1,
          [styles.actions__item__status_loss]: data.score === -1,
          [styles.actions__item__status_null]: data.score === 0,
        })}></div>
      <div className={styles.actions__item__content}>
        <div className={styles.actions__item__header}>
          {data.fio !== 'undefined undefined undefined' && (
            <div className={styles.actions__item__player}>{data.fio}</div>
          )}
          <div className={styles.actions__item__actionName}>
            <span>{data.name_action}</span>
          </div>
        </div>
        <div className={styles.actions__item__result}>
          Результат:<span>{data.result}</span>
        </div>
        {data.condition && (
          <div className={styles.actions__item__condition}>
            Условие:<span>{data.condition}</span>
          </div>
        )}
        {(role === 'EDITOR' || role === 'ADMIN') && (
          <div
            className={styles.actions__item__delete}
            onClick={() => onDeleteAction(data.id_action)}>
            Удалить
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionTile;
