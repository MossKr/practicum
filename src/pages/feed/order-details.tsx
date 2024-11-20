import React, { useEffect, useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { selectFeedOrders, selectFeedConnectionStatus, wsConnecting } from '../../services/feed/feedSlice';
import {
  selectProfileOrders,
  selectProfileOrdersConnectionStatus,
  wsConnecting as wsProfileConnecting,
} from '../../services/feed/profileOrdersSlice';
import { selectIngredients } from '../../services/ingredients/ingredientsSlice';
import styles from './order-details.module.css';
import { CurrencyIcon, FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import { Ingredient } from '../../utils/typesTs';
import { WS_FEED_URL, WS_PROFILE_ORDERS_URL } from '../../utils/constants';
import Cookies from 'js-cookie';
import Preloader from '../../components/common/preloader/preloader';

interface OrderDetailsProps {
  orderId: string | undefined;
  isPage?: boolean;
}

interface Order {
  _id: string;
  ingredients: string[];
  status: 'done' | 'pending' | 'created';
  number: number;
  createdAt: string;
  updatedAt: string;
  name?: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId, isPage = false }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const feedOrders = useAppSelector(selectFeedOrders);
  const feedConnectionStatus = useAppSelector(selectFeedConnectionStatus);
  const profileOrders = useAppSelector(selectProfileOrders);
  const profileOrdersStatus = useAppSelector(selectProfileOrdersConnectionStatus);
  const allIngredients = useAppSelector(selectIngredients);

  useEffect(() => {
    if (feedOrders.length === 0 && feedConnectionStatus === 'idle') {
      dispatch(wsConnecting({ url: WS_FEED_URL }));
    }
    const token = Cookies.get('accessToken');
    if (token && profileOrders.length === 0 && profileOrdersStatus === 'idle') {
      const extractedToken = token.replace('Bearer ', '');
      dispatch(wsProfileConnecting({
        url: WS_PROFILE_ORDERS_URL,
        token: extractedToken
}));
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    dispatch,
    feedOrders.length,
    profileOrders.length,
    feedConnectionStatus,
    profileOrdersStatus
  ]);

  const order = useMemo(() => {
    const allOrders: Order[] = [...feedOrders, ...profileOrders];
    return allOrders.find((order: Order) => order._id === orderId);
  }, [feedOrders, profileOrders, orderId]);

  const orderIngredients = useMemo(() => {
    if (!order) return [];
    return order.ingredients
      .map((id: string) => allIngredients.find((ing: Ingredient) => ing._id === id))
      .filter((ing): ing is Ingredient => ing !== undefined);
  }, [order, allIngredients]);

  const ingredientsWithCount = useMemo(() => {
    const uniqueIngredientsMap = orderIngredients.reduce<{[key: string]: { ingredient: Ingredient, count: number }}>((acc, ing) => {
      if (!acc[ing._id]) {
        acc[ing._id] = {
          ingredient: ing,
          count: orderIngredients.filter(item => item._id === ing._id).length
        };
      }
      return acc;
    }, {});

    return Object.values(uniqueIngredientsMap).map(item => ({
      ...item.ingredient,
      count: item.count
    }));
  }, [orderIngredients]);


  const totalPrice = useMemo(() =>
    ingredientsWithCount.reduce((sum, ing) => sum + (ing.price * ing.count), 0),
    [ingredientsWithCount]
  );

  useEffect(() => {
    if (
      (feedOrders.length > 0 || profileOrders.length > 0) &&
      (feedConnectionStatus === 'connected' && profileOrdersStatus === 'connected')
    ) {
      setIsLoading(false);
    }
  }, [feedOrders, profileOrders, feedConnectionStatus, profileOrdersStatus]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!order) {
    return (
      <div className={styles.notFound}>
        <p className="text text_type_main-medium">Заказ не найден</p>
        {isPage && (
          <p className="text text_type_main-default text_color_inactive mt-4">
            Возможно, заказ был удален или еще не загружен
          </p>
        )}
      </div>
    );
  }

  const getStatusText = (status: 'done' | 'pending' | 'created') => {
    switch (status) {
      case 'done': return 'Выполнен';
      case 'pending': return 'Готовится';
      case 'created': return 'Создан';
    }
  };

  const getStatusClass = (status: 'done' | 'pending' | 'created') => {
    switch (status) {
      case 'done': return styles.statusDone;
      case 'pending': return styles.statusPending;
      case 'created': return styles.statusCreated;
    }
  };

  return (
    <div className={styles.orderDetails}>
      <div className={styles.header}>
        <h2 className={`${styles.orderNumber} text text_type_digits-default`}>#{order.number}</h2>
      </div>
      <h3 className="text text_type_main-medium mt-10 mb-3">{order.name}</h3>
      <p className={`${styles.status} ${getStatusClass(order.status)} text text_type_main-default mb-15`}>
        {getStatusText(order.status)}
      </p>
      <h4 className="text text_type_main-medium mb-6">Состав:</h4>
      <ul className={styles.ingredientList}>
        {ingredientsWithCount.map((ing, index) => (
          <li key={index} className={styles.ingredientItem}>
            <img src={ing.image_mobile} alt={ing.name} className={styles.ingredientImage} />
            <span className="text text_type_main-default">{ing.name}</span>
            <span className={`${styles.price} text text_type_digits-default`}>
              {ing.count} x {ing.price} <CurrencyIcon type="primary" />
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
