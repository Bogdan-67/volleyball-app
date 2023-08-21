import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../scss/statistics.scss';
import qs from 'qs';
import { Column, useSortBy, useTable } from 'react-table';
import styles from './trainingEdit.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  SelectTrain,
  SelectTrainError,
  SelectTrainPlayers,
  SelectTrainStatus,
  getTeamTrain,
  setDate,
  setTeam,
  TrainParams,
  setTrainParams,
  deleteAction,
  deleteTeamTrain,
  deletePlayerTrain,
  addPlayerTrain,
} from '../../redux/slices/trainSlice';
import { useAppDispatch } from '../../redux/store';
import ActionModal, { Option } from '../../components/ActionModal';
import TeamSearchBar from '../../components/TeamSearchBar';
import { SelectAccountID, SelectUserRole, Status } from '../../redux/slices/profileSlice';
import Modal from '../../components/Modal';
import MyCalendar from '../../components/Calendar';
import classNames from 'classnames';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import Accordion from '../../components/AccordionTrain';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import {
  SelectTrainActions,
  SelectTrainActionsCount,
  SelectTrainActionsError,
  SelectTrainActionsStatus,
  getTrainActions,
} from '../../redux/slices/actionsSlice';
import TrainService from '../../services/TrainService';
import { AnimatePresence, motion } from 'framer-motion';
import Pagination from '../../components/Pagination';
import { TiUserDelete } from 'react-icons/ti';
import pageMotion from '../../components/pageMotion';
import { useAppSelector } from '../../hooks/redux';
import UserSearchBar from '../../components/UserSearchBar';
import { ISelectUser } from '../../models/ISelectUser';
import ActionTile from '../../components/ActionTile';

export interface Cols {
  fio: string;
  inning_stat: string;
  blocks_stat: string;
  attacks_stat: string;
  catch_stat: string;
  defence_stat: string;
  support_stat: string;
  id_train?: number;
}

export const columnNames = {
  fio: 'ФИО',
  inning_stat: 'Подача',
  blocks_stat: 'Блок',
  attacks_stat: 'Атака',
  catch_stat: 'Прием',
  defence_stat: 'Защита',
  support_stat: 'Передача',
  id_train: 'ID',
};

type SelectedUser = ISelectUser & {
  player: string;
};

export const limitVariants = [5, 10, 15];

export const TrainingEdit: React.FC = () => {
  // Redux
  const players = useSelector(SelectTrainPlayers);
  const actions = useSelector(SelectTrainActions);
  const count = useSelector(SelectTrainActionsCount);
  const actionsStatus = useSelector(SelectTrainActionsStatus);
  const actionsError = useSelector(SelectTrainActionsError);
  const account_id = useSelector(SelectAccountID);
  const status = useSelector(SelectTrainStatus);
  const error = useSelector(SelectTrainError);
  const { team, date } = useSelector(SelectTrain);
  const role = useAppSelector(SelectUserRole);
  // Модальное окно добавить действие
  const [isActive, setIsActive] = useState<boolean>(false);
  const [activePlayer, setActivePlayer] = useState<number>(null);
  // Модальное окно сменить тренировку
  const [isChangeTrain, setIsChangeTrain] = useState<boolean>(false);
  const [activeDate, setActiveDate] = useState(null);
  const [isValidModal, setIsValidModal] = useState(false);
  const [activeTeam, setActiveTeam] = useState<Option>(null);
  const [dates, setDates] = useState<string[]>([]);
  // Модальное окно добавить игрока
  const [isAddPlayer, setIsAddPlayer] = useState<boolean>(false);
  const [newPlayer, setNewPlayer] = useState<SelectedUser>(null);
  const [checkedPlayer, setCheckedPlayer] = useState<boolean>(true);
  // Пагинация действий
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  // Стейты первого рендера
  const isSearch = React.useRef(false);
  const isMounted = useRef(false);
  const location = useLocation();

  const [matches, setMatches] = useState(window.matchMedia('(min-width: 860px)').matches);

  useEffect(() => {
    window
      .matchMedia('(min-width: 860px)')
      .addEventListener('change', (e) => setMatches(e.matches));
  }, []);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isEven = (idx: number) => idx % 2 === 0;
  const isOdd = (idx: number) => idx % 2 === 1;

  // Если был первый рендер, то проверяем URL-параметры и сохраняем в редуксе
  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1)) as unknown as TrainParams;

      dispatch(
        setTrainParams({
          team: params.team,
          date: params.date,
        }),
      );
      isSearch.current = true;
    }
  }, []);

  // Если изменили параметры и был первый рендер
  useEffect(() => {
    if (team && date) {
      const queryString = qs.stringify({
        team: team,
        date: date,
      });

      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [team, date]);

  // Если был первый рендер, то запрашиваем тренировку
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (isSearch.current && isMounted.current && team && date) {
      dispatch(
        getTeamTrain({
          account_id,
          team,
          date,
        }),
      );
      dispatch(
        getTrainActions({
          team,
          date,
          limit,
          page,
        }),
      );
    }
    isSearch.current = false;
  }, [team, date]);

  useEffect(() => {
    if (isChangeTrain) {
      setActiveDate(null);
    }
  }, [isChangeTrain]);

  const fetchDates = async (day_team: string) => {
    try {
      const fetch = await TrainService.getTeamDates(day_team);

      return fetch.data;
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {}, [dates]);

  useEffect(() => {
    setActiveDate(null);
    if (activeTeam) {
      fetchDates(activeTeam.value).then((data) => {
        setDates(data);
      });
    } else {
      setDates([]);
    }
  }, [activeTeam]);

  useEffect(() => {
    if (activeDate && activeTeam) {
      setIsValidModal(true);
    } else {
      setIsValidModal(false);
    }
  }, [activeDate, activeTeam]);

  useEffect(() => {
    if (team && date) {
      dispatch(
        getTrainActions({
          team,
          date,
          limit,
          page,
        }),
      );
    }
  }, [players]);

  const onChangeDate = (value) => {
    setActiveDate(value);
  };

  const onClickAddAction = (id_train: number) => {
    setActivePlayer(id_train);
    setIsActive(true);
  };

  const onDeleteAction = (id_action: number) => {
    if (window.confirm('Удалить действие?')) {
      dispatch(deleteAction({ id_action }));
    }
  };

  const changeTrain = () => {
    setIsChangeTrain(false);
    setPage(1);
    setLimit(5);

    const formattedDate = `${activeDate.getFullYear()}-${
      activeDate.getMonth() + 1
    }-${activeDate.getDate()}`;

    dispatch(setTeam(activeTeam.value));
    dispatch(setDate(formattedDate));
    dispatch(
      getTeamTrain({
        account_id,
        team: activeTeam.value,
        date: formattedDate,
      }),
    );
    dispatch(
      getTrainActions({
        team: activeTeam.value,
        date: formattedDate,
        limit,
        page,
      }),
    );
  };

  const updateTrain = () => {
    dispatch(
      getTeamTrain({
        account_id,
        team,
        date,
      }),
    );
    dispatch(
      getTrainActions({
        team: team,
        date: date,
        limit,
        page,
      }),
    );
  };

  const handlePageClick = (selected: number) => {
    setPage(selected);
  };

  useEffect(() => {
    if (team && date) {
      dispatch(
        getTrainActions({
          team: team,
          date: date,
          limit,
          page,
        }),
      );
    }
  }, [page, limit]);

  const deleteTrain = () => {
    if (window.confirm('Удалить тренировку?')) {
      dispatch(
        deleteTeamTrain({
          account_id,
          date,
          team,
        }),
      );
      navigate('');
    }
  };

  const onClickDeletePlayer = (id_train: number) => {
    if (window.confirm('Удалить игрока из команды?')) {
      dispatch(
        deletePlayerTrain({
          account_id,
          id_train,
        }),
      );
    }
  };

  const onClickAddPlayer = (id: number) => {
    setNewPlayer(null);
    setIsAddPlayer(false);
    dispatch(
      addPlayerTrain({
        account_id: id,
        date: date,
        team: team,
      }),
    );
  };

  useEffect(() => {
    if (newPlayer) {
      setCheckedPlayer(checkPlayer());
    }
  }, [newPlayer]);

  const checkPlayer = () => {
    const result = players.filter((obj) => obj.fio === newPlayer.player);

    if (result.length === 0) return true;
    else return false;
  };

  const playersStatsData = useMemo(
    () =>
      players.map((obj) => {
        const newObj = { ...obj };
        for (var key in newObj) {
          if (newObj.hasOwnProperty(key)) {
            if (key !== 'fio' && key !== 'id_train' && key !== 'id_account') {
              newObj[key] = Number(newObj[key] * 100).toFixed() + '%';
            }
          }
        }
        return newObj;
      }),
    [players],
  );

  const playersStatsColumns = useMemo<Column<Cols>[]>(
    () =>
      players[0]
        ? Object.keys(players[0]).map((key) => {
            return {
              Header: () => <div title='Сортировать'>{columnNames[key]}</div>,
              accessor: key as keyof Cols,
              disableSortBy: false,
            };
          })
        : [],
    [players],
  );

  const tableHooks = (hooks) => {
    if (role === 'ADMIN') {
      hooks.visibleColumns.push((columns: Column<Cols>[]) => [
        ...columns,
        {
          id: 'Select',
          Header: '',
          Cell: ({ row, value }) => (
            <button
              className={styles.selectButton}
              onClick={() => onClickAddAction(+JSON.stringify(row.values.id_train))}>
              Добавить
            </button>
          ),
        },
        {
          id: 'Delete',
          Header: '',
          Cell: ({ row, value }) => (
            <button
              style={{ pointerEvents: role === 'ADMIN' ? 'all' : 'none' }}
              className={classNames(styles.selectButton, styles.deleteButton)}
              onClick={() => onClickDeletePlayer(+JSON.stringify(row.values.id_train))}>
              <TiUserDelete />
            </button>
          ),
        },
      ]);
    } else {
      hooks.visibleColumns.push((columns: Column<Cols>[]) => [
        ...columns,
        {
          id: 'Select',
          Header: '',
          Cell: ({ row, value }) => (
            <button
              className={styles.selectButton}
              onClick={() => onClickAddAction(+JSON.stringify(row.values.id_train))}>
              Добавить
            </button>
          ),
        },
      ]);
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Cols>(
    {
      columns: playersStatsColumns,
      data: playersStatsData,
      initialState: {
        hiddenColumns: ['id_train', 'id_account'],
      },
    },
    tableHooks,
    useSortBy,
  );

  return (
    <motion.div variants={pageMotion} initial='hidden' animate='show' exit='exit'>
      <div className={styles.train}>
        <div className={styles.train__date}>
          <p>Дата:</p>
          {date ? (
            <span>{date.split('-').reverse().join('.')}</span>
          ) : (
            <p className={styles.train__group_notSelected}>Не выбрано</p>
          )}
        </div>
        <div className={styles.train__group}>
          <p>Группа:</p>
          {team ? (
            <span>{team}</span>
          ) : (
            <p className={styles.train__group_notSelected}>Не выбрано</p>
          )}
        </div>
        <div className={styles.train__buttons}>
          <button
            className={classNames(styles.train__buttons__btnChange, {
              [styles.pulse]: players.length === 0 && status !== Status.ERROR && !isChangeTrain,
            })}
            onClick={() => setIsChangeTrain(true)}>
            Сменить тренировку
          </button>
          {role === 'ADMIN' && players.length !== 0 && !error && status === Status.SUCCESS && (
            <button className={styles.train__buttons__btnDelete} onClick={() => deleteTrain()}>
              Удалить тренировку
            </button>
          )}
        </div>
        {players.length === 0 &&
        (!location.search ||
          !new URLSearchParams(location.search).get('date') ||
          !new URLSearchParams(location.search).get('team')) &&
        status !== Status.ERROR ? (
          <div className={styles.train__error}>
            <span>😕</span>
            Выберите дату тренировки и группу.
          </div>
        ) : status === Status.ERROR || (players.length === 0 && status !== Status.LOADING) ? (
          <div className={styles.train__error}>
            <span>😕</span>
            {error ? error : 'Произошла ошибка'}
            <p>Введите данные еще раз или повторите попытку позже.</p>
          </div>
        ) : status === Status.LOADING ? (
          <>
            <LoadingSpinner />
          </>
        ) : (
          <>
            {!matches ? (
              <>
                <Accordion
                  playersStats={players}
                  buttonEnabled={true}
                  onClickAddAction={onClickAddAction}
                  onClickDelete={onClickDeletePlayer}
                />
              </>
            ) : (
              <table
                className='table'
                {...getTableProps()}
                style={{ borderRadius: '5px !important' }}>
                <thead className='backgroud_table2'>
                  {headerGroups.map((headerGroup, index) => (
                    <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, index) => (
                        <th
                          key={index}
                          className={classNames(styles.table__header__column)}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps({ title: undefined }),
                          )}>
                          {column.render('Header')}
                          {/* Add a sort direction indicator */}
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <AiOutlineCaretDown
                                  title='По убыванию'
                                  className={styles.sortIcon}
                                />
                              ) : (
                                <AiOutlineCaretUp
                                  title='По возрастанию'
                                  className={styles.sortIcon}
                                />
                              )
                            ) : (
                              ''
                            )}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row, idx) => {
                    prepareRow(row);

                    return (
                      <tr
                        key={idx}
                        {...row.getRowProps()}
                        className={
                          isEven(idx) ? 'backgroud_table' : isOdd(idx) ? 'backgroud_table2' : ''
                        }>
                        {row.cells.map((cell, index) => (
                          <td
                            key={index}
                            className={
                              index === row.cells.length - 1 || index === row.cells.length - 2
                                ? 'btn_cell'
                                : ''
                            }
                            {...row.getRowProps()}>
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            <button className={styles.train__buttons__btnAdd} onClick={() => setIsAddPlayer(true)}>
              + Добавить игрока
            </button>

            <AnimatePresence>
              <div className={styles.actions}>
                <h3 className={styles.actions__title}>Последние действия</h3>
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
                        <div className={styles.actions__list__showNum}>
                          <p>Показывать на странице:</p>
                          {limitVariants.map((item, i) => (
                            <span
                              key={i}
                              className={classNames(styles.actions__list__showNum__item, {
                                [styles.actions__list__showNum__item_active]: item === limit,
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
                {limit !== count && limit < count && (
                  <>
                    <div
                      className={styles.actions__showAll}
                      onClick={() => {
                        setLimit(count);
                        setPage(1);
                      }}>
                      Показать все
                    </div>{' '}
                    <Pagination
                      page={page}
                      pageCount={Math.ceil(count / limit)}
                      handlePageClick={handlePageClick}
                    />
                  </>
                )}
              </div>
            </AnimatePresence>
          </>
        )}
      </div>
      <ActionModal
        isActive={isActive}
        setIsActive={setIsActive}
        id_train={activePlayer}
        updateTrain={updateTrain}
      />
      <Modal isActive={isChangeTrain} setIsActive={setIsChangeTrain}>
        <div className={styles.changeModal}>
          <div className={styles.changeModal__group}>
            <p>Группа:</p>
            <TeamSearchBar setTeam={setActiveTeam} />
          </div>
          <div
            className={styles.changeModal__date}
            style={{
              pointerEvents: activeTeam ? 'all' : 'none',
              opacity: activeTeam ? '1' : '0.5',
            }}>
            {/* <p>Дата:</p> */}
            <MyCalendar
              onChange={onChangeDate}
              value={activeDate}
              selectRange={false}
              dates={dates}
              disableTiles={true}
            />
            <div
              className={styles.changeModal__date__blind}
              style={{ display: !activeTeam ? 'flex' : 'none' }}>
              Выберите команду
            </div>
          </div>
          <button
            disabled={!isValidModal}
            className={classNames(styles.changeModal__btnAccept, {
              [styles.changeModal__btnAccept_notValid]: !isValidModal,
            })}
            onClick={() => changeTrain()}>
            Сменить тренировку
          </button>
        </div>
      </Modal>
      <Modal isActive={isAddPlayer} setIsActive={setIsAddPlayer}>
        <div className={styles.addModal}>
          <h2 className={styles.addModal__title}>Выберите игрока</h2>
          <UserSearchBar
            setCollabs={setNewPlayer}
            isMulti={false}
            isClearable={false}
            filter={players.map((obj) => obj.id_account)}
          />
          {!checkedPlayer && <div className={styles.addModal__error}>Этот игрок уже играет</div>}
          <button
            className={classNames(styles.addModal__button, {
              [styles.addModal__button_disabled]: !newPlayer || !checkedPlayer,
            })}
            onClick={(e) => {
              e.preventDefault();
              onClickAddPlayer(newPlayer.id_account);
            }}>
            Добавить
          </button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default TrainingEdit;
