import { FC, useState } from 'react';
import { ITrain } from '../../models/ITrain';
import styles from './AccordionItem.module.scss';
import { columnNames } from '../../pages/TrainingEdit';

type AccordionItemProps = ITrain & {
  onClickAddAction: (id_train: number) => void;
};

const AccordionItem: FC<AccordionItemProps> = (props) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  let data = { ...props };
  delete data.onClickAddAction;

  const onClickAddAction = props.onClickAddAction;

  return (
    <div className={styles.accordion__item}>
      <div className={styles.accordion__title} onClick={() => setIsActive(!isActive)}>
        <div>{props.fio}</div>
        <div>{isActive ? '-' : '+'}</div>
      </div>
      {isActive && (
        <div className={styles.accordion__content}>
          {Object.entries(data)
            .filter((arr) => arr[0] !== 'fio' && arr[0] !== 'id_train')
            .map((arr, index) => (
              <div key={index} className={styles.accordion__content_list}>
                <div>{columnNames[arr[0]]}</div>
                <div className={styles.accordion__content_rez}>{arr[1].toString()}</div>
              </div>
            ))}
          <button className='select--button' onClick={() => onClickAddAction(data.id_train)}>
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
