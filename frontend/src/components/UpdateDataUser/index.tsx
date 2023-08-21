import { useState, useEffect, ChangeEvent } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { SelectUserID, updateUser } from '../../redux/slices/profileSlice';
import styles from './UpdateDataUser.module.scss';
import MaskedInput from 'react-text-mask';
import { phoneNumberMask } from '../RegistrForm';
import { useSelector } from 'react-redux';
import { updateOneUser } from '../../redux/slices/userSlice';
import { IUser } from '../../models/IUser';

interface PropsValues {
  user: IUser;
  isUpdate?: (value: boolean) => void;
  setIsActive: (value: boolean) => void;
}
//Валидация для email
export const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UpdateUser = (props: PropsValues) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: props.user?.name,
    surname: props.user?.surname,
    patronimyc: props.user?.patronimyc,
    email: props.user?.email,
    phone: props.user?.phone,
    team: props.user?.team,
  });
  const [errorsState, setErrorsState] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    patronimyc: '',
    team: '',
  });
  const [disable, setDisable] = useState(true);

  const authId = useSelector(SelectUserID);
  // Заносим данные при первой загрузке
  useEffect(() => {
    setFormData({
      name: props.user?.name,
      surname: props.user?.surname,
      patronimyc: props.user?.patronimyc,
      email: props.user?.email,
      phone: props.user?.phone,
      team: props.user?.team,
    });

    setDisable(true);
  }, [props.user, phoneNumberMask]);
  //обновляем стейт с disable для кнопки если все данные
  //введены без ошибок и изменилось хотя бы одно поле
  useEffect(() => {
    const areAllErrorsEmpty = Object.values(errorsState).every((error) => error === '');
    const changedPhone = formData.phone
      ? formData.phone
          .replace(/\)/g, '')
          .replace(/\(/g, '')
          .replace(/-/g, '')
          .replace(/ /g, '')
          .replace(/_/g, '')
      : '';
    if (
      (formData.name !== props.user?.name ||
        formData.surname !== props.user?.surname ||
        changedPhone !== props.user?.phone ||
        formData.email !== props.user?.email ||
        formData.patronimyc !== props.user?.patronimyc ||
        formData.team !== props.user?.team) &&
      areAllErrorsEmpty
    ) {
      setDisable(false);
    } else setDisable(true);
  }, [formData, errorsState]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    const validationFunctions = {
      name: (value: string) => {
        if (/\d/.test(value)) {
          return 'Имя не должно содержать цифры';
        } else {
          return '';
        }
      },
      surname: (value: string) => {
        if (/\d/.test(value)) {
          return 'Фамилия не должна содержать цифры';
        } else {
          return '';
        }
      },
      patronimyc: (value: string) => {
        if (/\d/.test(value)) {
          return 'Отчество не должно содержать цифры';
        } else {
          return '';
        }
      },
      phone: (value: string) => {
        const changedPhoneBefore = props.user.phone;
        const changedPhone = value
          .replace(/\)/g, '')
          .replace(/\(/g, '')
          .replace(/-/g, '')
          .replace(/ /g, '')
          .replace(/_/g, '');

        if (changedPhone.length !== 12) {
          return 'Проверьте правильность введенного номера';
        } else if (changedPhone === changedPhoneBefore) {
          return '';
        } else {
          return '';
        }
      },

      email: (value: string) => {
        if (!EMAIL_REGEXP.test(value)) {
          return 'Проверьте правильность ввденного Email';
        } else {
          return '';
        }
      },
      team: () => {
        return '';
      },
    };

    setErrorsState((prevErrors) => ({
      ...prevErrors,
      [name]: validationFunctions[name](value),
    }));
  };

  const handleUpdateUser = () => {
    const changedPhone = formData.phone
      .replace(/\)/g, '')
      .replace(/\(/g, '')
      .replace(/-/g, '')
      .replace(/ /g, '');
    if (window.confirm('Обновить данные?')) {
      const updatedUserData = {
        name: formData.name,
        surname: formData.surname,
        patronimyc: formData.patronimyc,
        email: formData.email,
        phone: changedPhone,
        login: props.user.login,
        team: formData.team,
      };
      props.setIsActive(false);
      if (props.user.id_user === authId) {
        dispatch(updateUser({ id_user: authId, userData: updatedUserData }));
      } else {
        dispatch(updateOneUser({ id_user: props.user.id_user, userData: updatedUserData }));
      }
      if (props.isUpdate) {
        props.isUpdate(true);
      }
    }
  };
  return (
    formData.name && (
      <div className={styles.update}>
        <h2>Обновление данных пользователя</h2>
        <div className={styles.update__blocks}>
          <div className={(styles.update__leftBlock, styles.block)}>
            <div>
              <label>
                Имя:
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete='off'
                  pattern='[^\d]{0,36}'
                  required
                />
                {errorsState.name && <div className={styles.error}>{errorsState.name}</div>}
              </label>
            </div>
            <div>
              <label>
                Фамилия:
                <input
                  type='text'
                  name='surname'
                  value={formData.surname}
                  onChange={handleChange}
                  pattern='[^\d]{0,36}'
                  required
                />
                {errorsState.surname && <div className={styles.error}>{errorsState.surname}</div>}
              </label>
            </div>
            <div>
              <label>
                Отчество (если имеется):
                <input
                  type='text'
                  name='patronimyc'
                  value={formData.patronimyc}
                  onChange={handleChange}
                  autoComplete='off'
                />
                {errorsState.patronimyc && (
                  <div className={styles.error}>{errorsState.patronimyc}</div>
                )}
              </label>
            </div>
          </div>
          <div className={(styles.update__rigthBlock, styles.block)}>
            <div>
              <label>
                Почта:
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete='off'
                  maxLength={100}
                  required
                />
                {errorsState.email && <div className={styles.error}>{errorsState.email}</div>}
              </label>
            </div>
            <div>
              <label className={styles.label}>
                Телефон:
                <MaskedInput
                  required
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete='off'
                  Length={12}
                  mask={phoneNumberMask}
                />
                {errorsState.phone && <div className={styles.error}>{errorsState.phone}</div>}
              </label>
            </div>
            <div>
              <label>
                Группа:
                <input
                  type='text'
                  name='team'
                  value={formData.team}
                  onChange={handleChange}
                  autoComplete='off'
                  maxLength={50}
                />
                {errorsState.team && <div className={styles.error}>{errorsState.team}</div>}
              </label>
            </div>
          </div>
        </div>
        <button
          type='submit'
          style={{ opacity: disable ? '0.5' : '1' }}
          onClick={handleUpdateUser}
          disabled={disable}>
          Обновить
        </button>
      </div>
    )
  );
};

export default UpdateUser;
