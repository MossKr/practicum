import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Input, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components'
import { resetPasswordConfirm, clearError, setNotification, selectNotification } from '../services/auth/authSlice';
import styles from "./styles.module.css";


function ResetPassword(): JSX.Element {
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, resetPasswordSuccess } = useAppSelector((state) => state.auth);
  const notification = useAppSelector(selectNotification);

  const checkFromForgotPassword = useCallback(() => {
    const fromForgotPassword = localStorage.getItem('fromForgotPassword');
    if (!fromForgotPassword) {
      dispatch(setNotification('Сначала запросите сброс пароля'));
      navigate('/forgot-password');
    }
  }, [navigate, dispatch]);

  useEffect(() => {
    checkFromForgotPassword();
    return () => {
      dispatch(clearError());
      dispatch(setNotification(null));
    };
  }, [dispatch, checkFromForgotPassword]);

  useEffect(() => {
    if (resetPasswordSuccess) {
      localStorage.removeItem('fromForgotPassword');
      dispatch(setNotification('Пароль успешно изменен'));
      navigate('/login');
    }
  }, [resetPasswordSuccess, navigate, dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password || !token) {
      dispatch(setNotification('Пожалуйста, заполните все поля'));
      return;
    }
    try {
      await dispatch(resetPasswordConfirm({ password, token })).unwrap();
    } catch (error) {
      dispatch(setNotification('Ошибка при сбросе пароля. Попробуйте еще раз'));
    }
  };

  return (
    <div className={styles.resetPasswordForm}>
      <h2 className="text text_type_main-medium mb-6">Восстановление пароля</h2>
      <form onSubmit={handleSubmit}>
        <PasswordInput
          placeholder='Введите новый пароль'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          value={password}
          name='password'
          extraClass="mb-6"
          autoComplete="new-password"
        />
        <Input
          type='text'
          placeholder='Введите код из письма'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
          value={token}
          name='token'
          error={false}
          errorText='Ошибка'
          size='default'
          extraClass="mb-6"
          autoComplete="off"
        />
        <Button
          type="primary"
          size="medium"
          htmlType="submit"
          extraClass="mb-20"
          disabled={isLoading}
        >
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </form>
      {error && <p className="text text_type_main-default text_color_error mb-4">{error}</p>}
      {notification && <p className="text text_type_main-default text_color_success mb-4">{notification}</p>}
      <p className="text text_type_main-default text_color_inactive">
        Вспомнили пароль? <Link to="/login" className={styles.link}>Войти</Link>
      </p>
    </div>
  );
}

export default ResetPassword;
