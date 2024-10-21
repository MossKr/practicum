import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components'
import styles from "./styles.module.css";
import { login, clearError, clearIntendedPath, setNotification, selectNotification } from '../services/auth/authSlice';
import { useFormAndValidation } from '../hooks/useFormAndValidation';

function Login() {
  const { values, handleChange, errors, isValid, resetForm, validateAll } = useFormAndValidation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated, intendedPath } = useSelector(state => state.auth);
  const notification = useSelector(selectNotification);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || intendedPath || '/';
      navigate(from, { replace: true });
      dispatch(clearIntendedPath());
    }
  }, [isAuthenticated, navigate, intendedPath, dispatch, location.state]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(setNotification(null));
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateAll();
    if (!isValid) {
      dispatch(setNotification('Пожалуйста, заполните все поля корректно'));
      return;
    }
    try {
      await dispatch(login({ email: values.email, password: values.password })).unwrap();
      dispatch(setNotification('Вход выполнен успешно'));
      resetForm();
    } catch (error) {
      dispatch(setNotification('Ошибка при входе. Проверьте введенные данные'));
    }
  };

  return (
    <div className={styles.loginForm}>
      <h2 className="text text_type_main-medium mb-6">Вход</h2>
      <form onSubmit={handleSubmit} noValidate>
        <Input
          type='email'
          placeholder='E-mail'
          onChange={handleChange}
          value={values.email || ''}
          name='email'
          error={!!errors.email}
          errorText={errors.email}
          size='default'
          extraClass="mb-6"
          autoComplete="email"
          required
        />
        <PasswordInput
          onChange={handleChange}
          value={values.password || ''}
          name='password'
          error={!!errors.password}
          errorText={errors.password}
          extraClass="mb-6"
          autoComplete="current-password"
          required
        />
        <Button
          type="primary"
          size="medium"
          htmlType="submit"
          extraClass="mb-20"
          disabled={isLoading || !isValid}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </form>
      {error && <p className="text text_type_main-default text_color_error mb-4">{error}</p>}
      {notification && <p className="text text_type_main-default text_color_success mb-4">{notification}</p>}
      <p className="text text_type_main-default text_color_inactive mb-4">
        Вы — новый пользователь? <Link to="/register" className={styles.link}>Зарегистрироваться</Link>
      </p>
      <p className="text text_type_main-default text_color_inactive">
        Забыли пароль? <Link to="/forgot-password" className={styles.link}>Восстановить пароль</Link>
      </p>
    </div>
  );
}

export default Login;
