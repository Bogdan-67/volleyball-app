import * as React from 'react';
import { motion } from 'framer-motion';
import { columnNames } from '../../pages/TrainingEdit';
import { useAppSelector } from '../../hooks/redux';
import { SelectUserRole } from '../../redux/slices/profileSlice';

export const ContentPlaceholder = ({ data, onClickAddAction, buttonEnabled, onClickDelete }) => {
  const role = useAppSelector(SelectUserRole);

  return (
    <motion.div
      variants={{ collapsed: { scale: 0.8 }, open: { scale: 1 } }}
      transition={{ duration: 0.5 }}
      className='content-placeholder'>
      {Object.entries(data)
        .filter((arr) => arr[0] !== 'fio' && arr[0] !== 'id_train' && arr[0] !== 'id_account')
        .map((arr, index) => {
          const num = arr[1].toString().replace('0.', '');

          return (
            <div key={index} className='accordion__content_list'>
              <div className='accordion__content_list_text'>{columnNames[arr[0]]}</div>
              <div className='accordion__content_rez'>
                {num + (num.length === 1 && num !== '0' ? '0%' : '%')}
              </div>
            </div>
          );
        })}
      {buttonEnabled && (
        <button className='accordion__button' onClick={() => onClickAddAction(data.id_train)}>
          Добавить
        </button>
      )}
      {role === 'ADMIN' && (
        <button
          style={{ pointerEvents: role === 'ADMIN' ? 'all' : 'none' }}
          className='accordion__deleteButton'
          onClick={() => onClickDelete(data.id_train)}>
          Удалить игрока
        </button>
      )}
    </motion.div>
  );
};
