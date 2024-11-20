import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './not-found.module.css';

function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.errorCode}>404</div>
      <h1 className="text text_type_main-large text_color_primary">
        Страница не найдена
      </h1>
      <p className="text text_type_main-medium text_color_inactive mt-8 mb-8 text_align_center">
        Упс! Похоже, вы заблудились в космосе бургеров.<br/>
        Страница, которую вы ищете, была съедена... <br/>или она оказалась слишком острой и сгорела.
      </p>

      <div className={styles.illustration}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 300"
          className={styles.burger}
        >
          <path
            d="M50 250 Q250 100 450 250"
            fill="#F2F2F2"
            stroke="#4C4CFF"
            strokeWidth="10"
          />
          <circle cx="250" cy="180" r="100" fill="#4C4CFF" />
          <circle cx="200" cy="150" r="20" fill="#FFFFFF" />
          <circle cx="300" cy="150" r="20" fill="#FFFFFF" />
        </svg>
      </div>

      <Link to="/" className={styles.linkButton}>
        <Button
          htmlType="button"
          type="primary"
          size="medium"
        >
          Вернуться на главную
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
