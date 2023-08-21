import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useAppDispatch } from '../../redux/store';
import {
  SelectInfoUsers,
  SelectUsers,
  fetchUsers,
  giveRoleUsers,
  removeRoleUsers,
  searchUsers,
} from '../../redux/slices/userSlice';
import { AnimatePresence, motion } from 'framer-motion';
import debounce from 'lodash.debounce';

import styles from './players.module.scss';
import { useSelector } from 'react-redux';
import ProfileInfo from '../../components/ProfileInfo';
import Modal from '../../components/Modal';
import UpdateUser from '../../components/UpdateDataUser';
import pageMotion from '../../components/pageMotion';
import { ISelectUser } from '../../models/ISelectUser';
import UserSearchBar from '../../components/UserSearchBar';
import classNames from 'classnames';
import SelectBar from '../../components/SelectBar';
import { Option } from '../../components/SelectBar';
import RoleService from '../../services/RoleService';
import { SelectUserID } from '../../redux/slices/profileSlice';
import UserService from '../../services/UserService';
import { IUser } from '../../models/IUser';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { setSearchValue, setSearchValueGroup } from '../../redux/slices/filterSlice';
import { group } from 'console';

export interface PlayersInf {
  email: string;
  id_account: number;
  id_user: number;
  login: string;
  name: string;
  surname: string;
  patronimyc: string;
  phone: string;
  player: string;
  team: string;
  img: string;
}

export const columnUser = {
  email: 'Почта',
  id_account: 'ID_ACC',
  id_user: 'ID_U',
  login: 'Логин',
  name: 'Имя',
  surname: 'Фамилия',
  patronimyc: 'Отчество',
  phone: 'Телефон',
  player: 'ФИО',
  team: 'Группа',
};
const container = {
  hidden: {},
  visible: {
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

const roleNames = {
  USER: 'Пользователь',
  EDITOR: 'Редактор',
  ADMIN: 'Администратор',
};

export interface UsersFetch {
  count: number;
  users: IUser[];
}

export const Players = () => {
  const avatarSmall = true;

  const [initialLoad, setInitialLoad] = useState(true); // Отвечает за анимацию при первом рендере

  const [showModal, setShowModal] = useState<boolean>(false);
  const [changePhotoModal, setChangePhotoModal] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [valueGroup, setValueGroup] = useState<string>('');
  const [isLoad, setIsLoad] = useState(true);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUser>();
  // Модальные окна ролей
  const [giveRolesModal, setGiveRolesModal] = useState<boolean>(false);
  const [collabs, setCollabs] = useState<ISelectUser[]>([]);
  const [selectPlayers, setSelectPlayers] = useState<number[]>([]);
  const [selectedRole, setSelectedRole] = useState<Option>(null);
  const [roles, setRoles] = useState<Option[]>();
  const [rolesError, setRolesError] = useState<string>(null);
  const [removeRolesModal, setRemoveRolesModal] = useState<boolean>(false);
  // Стейты для пагинации
  const [limit, setLimit] = useState<number>(8);
  const [page, setPage] = useState<number>(1);
  const limitVariants = [8, 12, 16];

  useEffect(() => {
    console.log('collabs', collabs);
    const players: number[] = collabs.map((obj) => obj.id_account);
    setSelectPlayers(players);
  }, [collabs]);

  const dispatch = useAppDispatch();

  const users = useSelector(SelectInfoUsers);
  const players = users.users.map((obj) => {
    const user = {
      ...obj,
      player: obj.surname + ' ' + obj.name + ' ' + obj.patronimyc,
    };
    return user;
  });

  const filtredPlayers = useMemo(() => {
    return players.filter((user) => {
      return user.player.toLowerCase().includes(value.toLowerCase());
    });
  }, [players, value]);

  const fetchRoles = async () => {
    try {
      const roles = await RoleService.fetchRoles();
      return roles.data;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setIsLoad(false);
    fetchRoles()
      .then((res) => {
        const options = res.map((role) => {
          const option = { label: roleNames[role], value: role };
          return option;
        });
        setRoles(options);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    dispatch(fetchUsers({ page, limit }));
    console.log('Произошло изменние page, limit ');
    setInitialLoad(false); // присваиваем false после получение юзеров
  }, [page, limit]);

  useEffect(() => {
    let timerId;
    const delaySearch = () => {
      timerId = setTimeout(() => {
        dispatch(searchUsers({ value, valueGroup, page, limit }));
      }, 500);
    };
    delaySearch();
    return () => {
      clearTimeout(timerId);
    };
  }, [value, valueGroup]);

  useEffect(() => {
    setIsUpdate(false);
  }, [isUpdate]);

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const giveRole = () => {
    if (selectPlayers.length !== 0 && selectedRole) {
      dispatch(
        giveRoleUsers({
          role: selectedRole.value,
          users: selectPlayers,
        }),
      );
      setGiveRolesModal(false);
    }
  };

  const removeRole = () => {
    if (selectPlayers.length !== 0) {
      dispatch(
        removeRoleUsers({
          users: selectPlayers,
        }),
      );
      setRemoveRolesModal(false);
    }
  };

  const errVariants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
    visible: {
      opacity: 1,
    },
  };

  const handlePageClick = (selected: number) => {
    setPage(selected);
  };
  // для input FIO
  const inputRef = useRef<HTMLInputElement>(null);
  const onClickClear = () => {
    dispatch(setSearchValue(''));
    setValue('');
    inputRef.current?.focus();
  };

  const updateSearchValue = useCallback(
    debounce((value: string) => {
      dispatch(setSearchValue(value));
    }, 250),
    [],
  );
  // для input Group
  const inputRefGroup = useRef<HTMLInputElement>(null);
  const onClickClearGroup = () => {
    dispatch(setSearchValueGroup(''));
    setValueGroup('');
    inputRefGroup.current?.focus();
  };
  const updateSearchValueGroup = useCallback(
    debounce((valueGroup: string) => {
      dispatch(setSearchValueGroup(valueGroup));
    }, 250),
    [],
  );
  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    updateSearchValue(event.target.value);
  };
  const onChangeInputGroup = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueGroup(event.target.value);
    updateSearchValueGroup(event.target.value);
  };
  return (
    <motion.div variants={pageMotion} initial='hidden' animate='show' exit='exit'>
      <div className={styles.main}>
        <div className={styles.form}>
          <div className={styles.form__box}>
            <div className={styles.form__box_inp}>
              <div className={styles.root}>
                <label>Введите ФИО игрока:</label>
                <input
                  ref={inputRef}
                  className={styles.input}
                  type='text'
                  value={value}
                  onChange={onChangeInput}
                />
                {value && (
                  <svg
                    onClick={onClickClear}
                    className={styles.iconClear}
                    version='1.1'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <g id='grid_system' />
                    <g id='_icons'>
                      <path d='M5.3,18.7C5.5,18.9,5.7,19,6,19s0.5-0.1,0.7-0.3l5.3-5.3l5.3,5.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3   c0.4-0.4,0.4-1,0-1.4L13.4,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L12,10.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4   l5.3,5.3l-5.3,5.3C4.9,17.7,4.9,18.3,5.3,18.7z' />
                    </g>
                  </svg>
                )}
              </div>
              <div className={styles.root}>
                <label>Введите группу игрока:</label>
                <input
                  ref={inputRefGroup}
                  className={styles.input}
                  type='text'
                  value={valueGroup}
                  onChange={onChangeInputGroup}
                />
                {valueGroup && (
                  <svg
                    onClick={onClickClearGroup}
                    className={styles.iconClear}
                    version='1.1'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <g id='grid_system' />
                    <g id='_icons'>
                      <path d='M5.3,18.7C5.5,18.9,5.7,19,6,19s0.5-0.1,0.7-0.3l5.3-5.3l5.3,5.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3   c0.4-0.4,0.4-1,0-1.4L13.4,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L12,10.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4   l5.3,5.3l-5.3,5.3C4.9,17.7,4.9,18.3,5.3,18.7z' />
                    </g>
                  </svg>
                )}
              </div>
            </div>

            <div className={styles.form__roleButtons}>
              <button onClick={() => setGiveRolesModal(true)} className={styles.form__roleBtn}>
                Выдать роль
              </button>
              <button
                onClick={() => setRemoveRolesModal(true)}
                className={classNames(styles.form__roleBtn, styles.form__roleBtn_remove)}>
                Забрать роль
              </button>
            </div>
          </div>
        </div>
        {users.status === 'loading' ? (
          <LoadingSpinner />
        ) : users.error !== null ? (
          <div className={styles.error}>
            <span>😕</span>
            {users.error}
          </div>
        ) : users.users.length === 0 ? (
          <div className={styles.root__content__empty}>Нет пользователей</div>
        ) : (
          <>
            <motion.ul
              className={styles.container}
              variants={container}
              initial='hidden'
              animate='visible'>
              {filtredPlayers.map((player) => {
                return (
                  <motion.li
                    key={player.id_user}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    variants={item}>
                    <ProfileInfo
                      deleteBtn={true}
                      data={player}
                      inRow={false}
                      avatarSmall={avatarSmall}
                      roleBtn={true}
                      onClickEdit={() => handleEditUser(player)} // Передаем данные пользователя в обработчик
                      onClickEditPhoto={setChangePhotoModal}
                    />
                  </motion.li>
                );
              })}
            </motion.ul>
            {limit !== users.count && limit < users.count && (
              <>
                <Pagination
                  page={page}
                  pageCount={Math.ceil(users.count / limit)}
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

        <Modal isActive={showModal} setIsActive={setShowModal}>
          <UpdateUser isUpdate={setIsUpdate} user={selectedUser} setIsActive={setShowModal} />
        </Modal>
        <Modal isActive={giveRolesModal} setIsActive={setGiveRolesModal}>
          <div className={styles.addModal}>
            <h2 className={styles.addModal__title}>Выдача роли</h2>
            {rolesError && <div>{rolesError}</div>}
            <UserSearchBar setCollabs={setCollabs} isMulti={true} isClearable={false} />
            <div className={styles.addModal__separator}></div>
            <SelectBar
              setSelected={setSelectedRole}
              value={selectedRole}
              disabled={selectPlayers.length === 0}
              isMulti={false}
              isClearable={false}
              placeholder={'Выберите роль'}
              emptyMessage={'Роли не найдены'}
              options={roles}
            />
            <AnimatePresence>
              {selectedRole && selectedRole.value === 'ADMIN' && (
                <motion.div
                  variants={errVariants}
                  initial='hidden'
                  animate='visible'
                  exit='hidden'
                  className={styles.warning}>
                  Внимание! Администратор может удалять пользователей и тренировки. Выдавайте роль
                  администратора только доверенным лицам.
                </motion.div>
              )}
            </AnimatePresence>
            <button
              className={classNames(styles.addModal__button, {
                [styles.addModal__button_disabled]: selectPlayers.length === 0 || !selectedRole,
              })}
              onClick={(e) => {
                e.preventDefault();
                giveRole();
              }}>
              Подтвердить
            </button>
          </div>
        </Modal>
        <Modal isActive={removeRolesModal} setIsActive={setRemoveRolesModal}>
          <div className={styles.addModal}>
            <h2 className={styles.addModal__title}>Забрать роль</h2>
            {rolesError && <div>{rolesError}</div>}
            <UserSearchBar setCollabs={setCollabs} isMulti={true} isClearable={false} />
            <button
              className={classNames(styles.addModal__button, {
                [styles.addModal__button_disabled]: selectPlayers.length === 0,
              })}
              onClick={(e) => {
                e.preventDefault();
                removeRole();
              }}>
              Подтвердить
            </button>
          </div>
        </Modal>
      </div>
    </motion.div>
  );
};

export default Players;
