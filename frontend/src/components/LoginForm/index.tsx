import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Form, Field, withFormik, FormikProps } from 'formik';
import logo from '../../assets/img/Logo_VolleyBall.png';
import styles from './LoginForm.module.scss';
import LoginSchema from '../../models/validation/LoginSchema';
import { loginAccount } from '../../redux/slices/profileSlice';
import { bindActionCreators } from '@reduxjs/toolkit';
import { connect } from 'react-redux';

interface FormValues {
  login: string;
  password: string;
}

let setSubmittingHigher;

const InnerForm: React.FC = (props: FormikProps<FormValues>) => {
  const { touched, errors, isSubmitting } = props;

  return (
    <div className={styles.auth__2}>
      <Form className={styles.auth}>
        <img className={styles.auth__logo} width='44' src={logo} alt='Volleyball logo'></img>
        <h2 className={styles.auth__title}>Авторизация</h2>
        <div className={styles.auth__inputs}>
          <div className={classnames(styles.auth__forinput)}>
            <Field className={styles.auth__input} name='login' type='text' placeholder='Логин' />
            {errors.login && touched.login && <div>{errors.login}</div>}
          </div>
          <div className={classnames(styles.auth__forinput)}>
            <Field
              className={styles.auth__input}
              name='password'
              type='password'
              placeholder='Пароль'
            />
            {errors.password && touched.password && <div>{errors.password}</div>}
          </div>
        </div>
        <p className={styles.auth__text}>
          Нет аккаунта?&nbsp;
          <Link to='/registration' className={styles.auth__link}>
            Зарегистрироваться
          </Link>
        </p>
        <button type='submit' className={styles.auth__button} disabled={isSubmitting}>
          Войти
        </button>
      </Form>
      <p className={styles.auth__text_2}>
        Нет аккаунта?&nbsp;
        <Link to='/registration' className={styles.auth__2_button}>
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
};

interface LoginProps {
  initialLogin?: string;
  loginAccount: (values: FormValues) => void;
}

export const LoginForm = withFormik<LoginProps, FormValues>({
  // Transform outer props into form values
  mapPropsToValues: (props) => {
    return {
      login: props.initialLogin || '',
      password: '',
    };
  },

  validationSchema: LoginSchema,

  handleSubmit: (values, { props, setSubmitting }) => {
    props.loginAccount(values);
    setSubmittingHigher = setSubmitting;
  },
  displayName: 'LoginForm',
})(InnerForm);

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loginAccount,
    },
    dispatch,
  );

const Redux = connect(null, mapDispatchToProps)(LoginForm);

export default Redux;
