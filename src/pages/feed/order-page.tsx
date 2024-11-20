import React from 'react';
import OrderDetails from './order-details';
import { useParams } from 'react-router-dom';
import styles from './order-page.module.css';

const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className={styles.position}>
      <OrderDetails orderId={id} />
    </div>
  );
};

export default OrderPage;
