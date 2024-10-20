import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { getUser, updateUser, logout, setNotification, selectNotification } from '../services/auth/authSlice';
import styles from './styles.module.css';

function ProfileForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error, isAuthenticated } = useSelector((state) => state.auth);
  const notification = useSelector(selectNotification);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUser());
    } else {
      navigate('/login');
    }
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, password: '' });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      dispatch(setNotification(null));
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (!isEditing) setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { ...form };
    if (!form.password) delete updatedData.password;
    try {
      await dispatch(updateUser(updatedData)).unwrap();
      dispatch(setNotification('Профиль успешно обновлен'));
      setIsEditing(false);
    } catch (error) {
      dispatch(setNotification('Ошибка при обновлении профиля'));
    }
  };

  const handleCancel = () => {
    setForm({ name: user.name, email: user.email, password: '' });
    setIsEditing(false);
  };

  if (isLoading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        type="text"
        placeholder="Имя"
        onChange={handleChange}
        value={form.name}
        name="name"
        error={false}
        errorText="Ошибка"
        size="default"
        icon="EditIcon"
        extraClass={styles.input}
      />
      <Input
        type="email"
        placeholder="E-mail"
        onChange={handleChange}
        value={form.email}
        name="email"
        error={false}
        errorText="Ошибка"
        size="default"
        icon="EditIcon"
        extraClass={styles.input}
      />
      <Input
        type="password"
        placeholder="Пароль"
        onChange={handleChange}
        value={form.password}
        name="password"
        error={false}
        errorText="Ошибка"
        size="default"
        icon="EditIcon"
        extraClass={styles.input}
      />
      {isEditing && (
        <div className={styles.buttonContainer}>
          <Button htmlType="submit" type="primary" size="medium">
            Сохранить
          </Button>
          <Button htmlType="button" type="secondary" size="medium" onClick={handleCancel}>
            Отмена
          </Button>
        </div>
      )}
      {notification && <p className={`text text_type_main-default ${styles.notification}`}>{notification}</p>}
    </form>
  );
}

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUser());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(setNotification('Вы успешно вышли из системы'));
      navigate('/login');
      window.location.reload();
    } catch (error) {
      dispatch(setNotification('Ошибка при выходе из системы'));

    }
  };

  return (
    <div className={styles.profileContainer}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li>
            <NavLink
              to="/profile"
              end
              className={({ isActive }) =>
                `text text_type_main-medium ${isActive ? styles.active : styles.inactive}`
              }
            >
              Профиль
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile/orders"
              className={({ isActive }) =>
                `text text_type_main-medium ${isActive ? styles.active : styles.inactive}`
              }
            >
              История заказов
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className={`${styles.logout} text text_type_main-medium`}
            >
              Выход
            </button>
          </li>
        </ul>
        <p className={`${styles.navDescription} text text_type_main-medium`}>
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>
      <div className={styles.contentContainer}>
        <Routes>
          <Route path="/" element={<ProfileForm />} />
          <Route path="/orders" element={<div className="text text_type_main-medium">История заказов <p className="text text_type_main-default">(будет реализовано в следующем спринте)</p></div>} />
        </Routes>
      </div>
    </div>
  );
}

export default Profile;
