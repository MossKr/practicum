import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { getUser, updateUser, logout, setNotification, selectNotification } from '../services/auth/authSlice';
import styles from './styles.module.css';

interface FormState {
  name: string;
  email: string;
  password: string;
}

interface CustomInputProps {
  type: 'text' | 'email' | 'password';
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
  error: boolean;
  errorText: string;
  size: 'default' | 'small';
  icon: "EditIcon";
  extraClass: string;
  disabled: boolean;
  onIconClick: () => void;
}

const CustomInput: React.FC<CustomInputProps> = (props) => (
  <Input {...props} />
);

function ProfileForm(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error, isAuthenticated } = useSelector((state: any) => state.auth);
  const notification = useSelector(selectNotification);
  const [form, setForm] = useState<FormState>({ name: '', email: '', password: '' });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUser() as any);
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
      dispatch(setNotification(null) as any);
    };
  }, [dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (!isEditing) setIsEditing(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const updatedData: Partial<FormState> = { name: form.name, email: form.email };
    if (form.password) {
      updatedData.password = form.password;
    }
    try {
       // @ts-ignore
      await dispatch(updateUser(updatedData) as any);
      dispatch(setNotification('Профиль успешно обновлен') as any);
      setIsEditing(false);
    } catch (error) {
      dispatch(setNotification('Ошибка при обновлении профиля') as any);
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
      <CustomInput
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
        disabled={!isEditing}
        onIconClick={() => setIsEditing(true)}
      />
      <CustomInput
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
        disabled={!isEditing}
        onIconClick={() => setIsEditing(true)}
      />
      <CustomInput
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
        disabled={!isEditing}
        onIconClick={() => setIsEditing(true)}
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

function Profile(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUser() as any);
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await dispatch(logout() as any);
      dispatch(setNotification('Вы успешно вышли из системы') as any);
      navigate('/login');
      window.location.reload();
    } catch (error) {
      dispatch(setNotification('Ошибка при выходе из системы') as any);
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
