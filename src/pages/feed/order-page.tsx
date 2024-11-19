import React from 'react';
import { useParams } from 'react-router-dom';
import OrderDetails from './order-details';
import styles from './order-page.module.css';

const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className={styles.orderPage}>
      <h2 className={`text text_type_main-medium ${styles.title}`}>Информация о заказе</h2>
      <OrderDetails orderId={id} />
    </div>
  );
};

export default OrderPage;
