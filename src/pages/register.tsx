import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components'
import styles from "./styles.module.css";
import { register, clearError, setNotification, selectNotification } from '../services/auth/authSlice';

function Register(): JSX.Element {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state: any) => state.auth);
  const notification = useSelector(selectNotification);

  useEffect(() => {
    return () => {
      // @ts-ignore
      dispatch(clearError());
      // @ts-ignore
      dispatch(setNotification(null));
    };
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // @ts-ignore
    dispatch(clearError());
    if (!name || !email || !password) {
      // @ts-ignore
      dispatch(setNotification('Пожалуйста, заполните все поля'));
      return;
    }
    try {
      // @ts-ignore
      await dispatch(register({ email, password, name })).unwrap();
      // @ts-ignore
      dispatch(setNotification('Регистрация прошла успешно'));
    } catch (error) {
      // @ts-ignore
      dispatch(setNotification('Ошибка при регистрации. Пожалуйста, попробуйте еще раз'));
    }
  };

  return (
    <div className={styles.registerForm}>
      <h2 className="text text_type_main-medium mb-6">Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type='text'
          placeholder='Имя'
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          value={name}
          name='name'
          error={false}
          errorText='Ошибка'
          size='default'
          extraClass="mb-6"
          autoComplete="name"
        />
        <Input
          type='email'
          placeholder='E-mail'
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          value={email}
          name='email'
          error={false}
          errorText='Ошибка'
          size='default'
          extraClass="mb-6"
          autoComplete="email"
        />
        <PasswordInput
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          value={password}
          name='password'
          extraClass="mb-6"
          autoComplete="new-password"
        />
        <Button
          type="primary"
          size="medium"
          htmlType="submit"
          extraClass="mb-20"
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>
      {error && <p className="text text_type_main-default text_color_error mb-4">{error}</p>}
      {notification && <p className="text text_type_main-default text_color_success mb-4">{notification}</p>}
      <p className="text text_type_main-default text_color_inactive">
        Уже зарегистрированы? <Link to="/login" className={styles.link}>Войти</Link>
      </p>
    </div>
  );
}

export default Register;