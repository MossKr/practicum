import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { resetPassword, clearError, setNotification, selectNotification } from '../services/auth/authSlice';
import styles from "./styles.module.css";

function ForgotPassword(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, resetPasswordRequestSuccess } = useAppSelector((state) => state.auth);
  const notification = useAppSelector(selectNotification);

  const handleResetPasswordSuccess = useCallback(() => {
    if (resetPasswordRequestSuccess) {
      localStorage.setItem('fromForgotPassword', 'true');
      dispatch(setNotification('Инструкции по сбросу пароля отправлены на ваш email'));
      navigate('/reset-password');
    }
  }, [resetPasswordRequestSuccess, navigate, dispatch]);

  useEffect(() => {
    handleResetPasswordSuccess();
    return () => {
      dispatch(clearError());
      dispatch(setNotification(null));
    };
  }, [dispatch, handleResetPasswordSuccess]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(resetPassword(email)).unwrap();
    } catch (error) {
      console.error('Password reset request failed:', error);
      dispatch(setNotification('Не удалось отправить запрос на сброс пароля. Пожалуйста, попробуйте еще раз.'));
    }
  };

  return (
    <div className={styles.forgotPasswordForm}>
      <h2 className="text text_type_main-medium mb-6">Восстановление пароля</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type='email'
          placeholder='Укажите e-mail'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          value={email}
          name='email'
          error={false}
          errorText='Ошибка'
          size='default'
          extraClass="mb-6"
        />
        <Button
          type="primary"
          size="medium"
          htmlType="submit"
          extraClass="mb-20"
          disabled={isLoading}
        >
          {isLoading ? 'Отправка...' : 'Восстановить'}
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

export default ForgotPassword;
