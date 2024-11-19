import React from 'react';
import { useSelector } from 'react-redux';
import { selectFeedOrders } from '../../services/feed/feedSlice';
import { selectProfileOrders } from '../../services/feed/profileOrdersSlice';
import { selectIngredients } from '../../services/ingredients/ingredientsSlice';
import styles from './order-details.module.css';
import { CurrencyIcon, FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import { Ingredient } from '../../utils/typesTs';

interface OrderDetailsProps {
  orderId: string | undefined;
}

interface Order {
  _id: string;
  ingredients: string[];
  status: string;
  number: number;
  createdAt: string;
  name?: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  const orders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const allIngredients = useSelector(selectIngredients);

  const allOrders: Order[] = [...(orders || []), ...(profileOrders || [])];

  const order = allOrders.find((order: Order) => order._id === orderId);

  if (!order) {
    return <div className={styles.notFound}>Заказ не найден</div>;
  }

  const orderIngredients: Ingredient[] = order.ingredients
    .map((id: string) => allIngredients.find((ing: Ingredient) => ing._id === id))
    .filter((ing): ing is Ingredient => ing !== undefined);

  const totalPrice = orderIngredients.reduce((sum: number, ing: Ingredient) => sum + ing.price, 0);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'done': return 'Выполнен';
      case 'pending': return 'Готовится';
      case 'created': return 'Создан';
      default: return 'Неизвестный статус';
    }
  };

  return (
      <div className={styles.orderDetails}>
        <div className={styles.header}>
          <h2 className={`${styles.orderNumber} text text_type_digits-default`}>#{order.number}</h2>
        </div>
        <h3 className="text text_type_main-medium mt-10 mb-3">{(order as any).name}</h3>
        <p className={`${styles.status} text text_type_main-default mb-15`}>
          {getStatusText(order.status)}
        </p>
        <h4 className="text text_type_main-medium mb-6">Состав:</h4>
        <ul className={styles.ingredientList}>
          {orderIngredients.map((ing, index) => (
            <li key={index} className={styles.ingredientItem}>
              <img src={ing.image_mobile} alt={ing.name} className={styles.ingredientImage} />
              <span className="text text_type_main-default">{ing.name}</span>
              <span className={`${styles.price} text text_type_digits-default`}>
                {ing.price} <CurrencyIcon type="primary" />
              </span>
            </li>
          ))}
        </ul>
        <div className={styles.footer}>
          <FormattedDate
            date={new Date(order.createdAt)}
            className="text text_type_main-default text_color_inactive"
          />
          <p className={`${styles.totalPrice} text text_type_digits-default`}>
            {totalPrice} <CurrencyIcon type="primary" />
          </p>
        </div>
      </div>
    );
  };

  export default OrderDetails;
