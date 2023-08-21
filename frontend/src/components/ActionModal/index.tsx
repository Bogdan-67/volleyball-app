import { FC, useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './ActionModal.module.scss';
import classNames from 'classnames';
import { useAppDispatch } from '../../redux/store';
import { SelectActionTypes, getActionsTypes } from '../../redux/slices/actionTypesSlice';
import { useSelector } from 'react-redux';
import { ActionType } from '../../models/IActionType';
import { BsInfoCircle } from 'react-icons/bs';
import ConditionsSelectBar from '../ConditionsSelectBar';
import { SelectTrainDate, SelectTrainTeam, postAction } from '../../redux/slices/trainSlice';
import useOnClickOutside from '../../hooks/onClickOutside';

interface ActionModalProps {
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  id_train: number;
  updateTrain: () => void;
}

type OutsideClick = MouseEvent & {
  path: Node[];
};

export type Option = {
  value: string;
  label: string;
};

const ActionModal: FC<ActionModalProps> = ({ isActive, setIsActive, id_train, updateTrain }) => {
  const dispatch = useAppDispatch();
  const { actionTypes } = useSelector(SelectActionTypes);
  const date = useSelector(SelectTrainDate);
  const team = useSelector(SelectTrainTeam);
  const [currentAction, setCurrentAction] = useState<ActionType>({
    id_action_type: null,
    name_type: '',
    result: [''],
    win_condition: [''],
    loss_condition: [''],
    description: '',
  });
  const [activeResult, setActiveResult] = useState<number>(0);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [selectedCondition, setSelectedCondition] = useState<Option>({
    value: '',
    label: 'Выберите условие',
  });
  const [isValid, setIsValid] = useState<boolean>(false);
  const infoRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30,
  };

  useEffect(() => {
    dispatch(getActionsTypes());
  }, []);

  useOnClickOutside(modalRef, () => setIsActive(false));
  useOnClickOutside(infoRef, () => setShowInfo(false));

  useEffect(() => {
    setSelectedCondition({ value: '', label: 'Выберите условие' });
    if (activeResult === 2) {
      setIsValid(true);
    } else setIsValid(false);
  }, [activeResult]);

  useEffect(() => {
    if (activeResult === 0 || activeResult === 1) {
      setIsValid(!/^\s*$/.test(selectedCondition.value));
    }
  }, [selectedCondition]);

  useEffect(() => {
    setSelectedCondition({ value: '', label: 'Выберите условие' });
  }, [currentAction]);

  useEffect(() => {
    if (isActive) {
      setCurrentAction(actionTypes[0]);
    }
  }, [isActive]);

  const changeAction = (id: number) => {
    const selectedAction = actionTypes.filter((item) => item.id_action_type === id);

    setCurrentAction(selectedAction[0]);
  };

  const onClickAdd = () => {
    setIsActive(false);

    const id_action_type = currentAction.id_action_type;
    const name_action = currentAction.name_type;
    const result = currentAction.result[activeResult];
    const condition = selectedCondition.value;
    const score = activeResult === 0 ? 1 : activeResult === 1 ? -1 : 0;

    setSelectedCondition({ value: '', label: 'Выберите условие' });

    dispatch(
      postAction({ id_train, id_action_type, name_action, result, condition, score, date, team }),
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
      },
    },
  };

  return (
    <div
      style={{ zIndex: !isActive ? -1 : 990 }}
      className={classNames(styles.action, { [styles.active]: isActive })}>
      <div
        ref={modalRef}
        className={classNames(styles.action__content, { [styles.active]: isActive })}>
        <div className={styles.action__current}>
          <h2 className={styles.action__title}>
            <span ref={infoRef}>
              <BsInfoCircle
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
              />
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    variants={container}
                    initial='hidden'
                    animate='show'
                    transition={{ duration: 0.2 }}
                    exit='hidden'
                    className={classNames(styles.action__info)}>
                    <p>{currentAction.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </span>
            {currentAction.name_type}
          </h2>
          <AnimatePresence mode='wait'>
            <ul className={styles.action__result}>
              {currentAction.result.map((item, index) => (
                <li
                  key={index}
                  onClick={() => setActiveResult(index)}
                  className={classNames(styles.action__resultItem, {
                    [styles.action__active]: index === activeResult,
                  })}>
                  <span>{item}</span>
                  {index === activeResult ? (
                    <motion.div
                      transition={{
                        delay: -2,
                        layout: {
                          duration: 0.2,
                          ease: 'easeOut',
                        },
                      }}
                      style={{
                        position: 'absolute',
                        bottom: '0px',
                        left: '0px',
                        right: 0,
                        height: '100%',
                        background: '#78c6ff',
                        borderRadius: '10px',
                        zIndex: 0,
                      }}
                      layoutId='highlight'
                    />
                  ) : null}
                </li>
              ))}
            </ul>
            {activeResult === 0 && (
              <motion.div
                variants={container}
                initial='hidden'
                animate='show'
                className={styles.action__condition}>
                <ConditionsSelectBar
                  data={currentAction.win_condition}
                  selected={selectedCondition}
                  setSelected={setSelectedCondition}
                />
              </motion.div>
            )}
            {activeResult === 1 && (
              <motion.div
                variants={container}
                initial='hidden'
                animate='show'
                className={styles.action__condition}>
                <ConditionsSelectBar
                  data={currentAction.loss_condition}
                  selected={selectedCondition}
                  setSelected={setSelectedCondition}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            disabled={!isValid}
            className={classNames(styles.action__addBtn, {
              [styles.action__addBtn_notValid]: !isValid,
            })}
            onClick={() => onClickAdd()}>
            Добавить
          </button>
        </div>
        <div className={styles.menu}>
          <h4 className={styles.menu__title}>Выбор действия</h4>
          <div className={styles.menu__list}>
            {actionTypes.map((obj) => (
              <div
                key={obj.id_action_type}
                className={classNames(styles.menu__item, {
                  [styles.menu__active]: currentAction.id_action_type === obj.id_action_type,
                })}
                onClick={() => changeAction(obj.id_action_type)}>
                <span>{obj.name_type}</span>
                {obj.id_action_type === currentAction.id_action_type ? (
                  <motion.div
                    transition={{
                      layout: {
                        duration: 0.1,
                        ease: 'easeOut',
                      },
                    }}
                    style={{
                      position: 'absolute',
                      left: '0px',
                      top: '0px',
                      height: '100%',
                      width: '100%',
                      background: '#78c6ff',
                      borderRadius: '5px',
                      zIndex: 0,
                    }}
                    layout
                    layoutId='select'
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
