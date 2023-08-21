import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  login: Yup.string().required('Обязательное поле'),
  password: Yup.string()
    .min(3, 'Пароль должен быть длинее 3 символов')
    .required('Обязательное поле'),
});
export default LoginSchema;
