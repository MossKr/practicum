import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CurrencyIcon,
  FormattedDate
} from '@ya.praktikum/react-developer-burger-ui-components';
import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedConnectionStatus,
  selectFeedError,
  wsConnecting,
  wsDisconnect,
} from '../../services/feed/feedSlice';
import { selectIngredients } from '../../services/ingredients/ingredientsSlice';
import styles from './feed.module.css';
import Preloader from '../../components/common/preloader/preloader';
import { Ingredient } from '../../utils/typesTs';

const WEBSOCKET_URL = 'wss://norma.nomoreparties.space/orders/all';
const MAX_VISIBLE_INGREDIENTS = 6;

interface FeedOrder {
  ingredients: string[];
  _id: string;
  status: 'done' | 'pending' | 'created';
  number: number;
  createdAt: string;
  updatedAt: string;
  name?: string;
}

const Feed: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


  const orders = useSelector(selectFeedOrders);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);
  const connectionStatus = useSelector(selectFeedConnectionStatus);
  const error = useSelector(selectFeedError);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(wsConnecting({ url: WEBSOCKET_URL }));

    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  const doneOrders = useMemo(() =>
    orders.filter((order: FeedOrder) => order.status === 'done').slice(0, 5),
    [orders]
  );

  const pendingOrders = useMemo(() =>
    orders.filter((order: FeedOrder) => order.status === 'pending').slice(0, 5),
    [orders]
  );

  const getOrderIngredients = (order: FeedOrder): Ingredient[] => {
    return order.ingredients
      .map(id => ingredients.find(ing => ing._id === id))
      .filter((ingredient): ingredient is Ingredient => ingredient !== undefined);
  };

  const calculateOrderPrice = (orderIngredients: Ingredient[]): number => {
    return orderIngredients.reduce((sum, ingredient) => sum + ingredient.price, 0);
  };

  if (connectionStatus === 'connecting' || ingredients.length === 0) {
    return <Preloader />;
  }

  if (connectionStatus === 'error') {
    return (
      <div className={styles.errorContainer}>
        <h2 className="text text_type_main-medium mb-4">Ошибка подключения</h2>
        <p className="text text_type_main-default mb-8">{error}</p>
      </div>
    );
  }

  const renderOrderColumn = (title: string, orders: FeedOrder[], isDone: boolean = false) => (
    <div className={styles.orderColumn}>
      <h2 className="text text_type_main-medium mb-6">{title}</h2>
      {orders.map((order) => (
        <div
          key={order._id}
          onClick={() => handleOrderClick(order._id)}
          className={styles.orderItem}
        >
          <p className={`text text_type_digits-default ${isDone ? styles.doneOrder : ''}`}>
            #{order.number}
          </p>
        </div>
      ))}
    </div>
  );

  const handleOrderClick = (orderId: string) => {
    navigate(`/feed/${orderId}`, {
      state: { background: location }
    });
  };




  return (
    <div className={styles.feedContainer}>
      <div className={styles.firstBlock}>
        <div className={styles.block}>
          <h1 className="text text_type_main-large mb-5">Лента заказов</h1>
          <div className={styles.content}>
            <div className={styles.orderListContainer}>
              <div className={styles.orderList}>
                {orders.map((order: FeedOrder) => {
                  const orderIngredients = getOrderIngredients(order);
                  const orderPrice = calculateOrderPrice(orderIngredients);
                  const visibleIngredients = orderIngredients.slice(0, MAX_VISIBLE_INGREDIENTS);
                  const hiddenCount = Math.max(0, orderIngredients.length - MAX_VISIBLE_INGREDIENTS);

                  return (
                    <div
                      key={order._id}
                      onClick={() => handleOrderClick(order._id)}
                      className={styles.orderCard}
                    >
                      <div className={styles.orderHeader}>
                        <p className="text text_type_digits-default">#{order.number}</p>
                        <FormattedDate date={new Date(order.createdAt)} className="text text_type_main-default text_color_inactive" />
                      </div>
                      <h3 className="text text_type_main-medium mt-6 mb-2">{order.name || `Заказ #${order.number}`}</h3>
                      <p className="text text_type_main-default mb-6">
                        {order.status === 'done' ? 'Выполнен' :
                         order.status === 'pending' ? 'Готовится' :
                         'Создан'}
                      </p>
                      <div className={styles.orderFooter}>
                        <div className={styles.ingredients}>
                          {visibleIngredients.map((ingredient, index) => (
                            <div key={index} className={styles.ingredientIcon} style={{zIndex: MAX_VISIBLE_INGREDIENTS - index}}>
                              <img src={ingredient.image_mobile} alt={ingredient.name} />
                            </div>
                          ))}
                          {hiddenCount > 0 && (
                            <div className={styles.ingredientIcon}>
                              <p className="text text_type_main-default">+{hiddenCount}</p>
                            </div>
                          )}
                        </div>
                        <div className={styles.price}>
                          <p className="text text_type_digits-default mr-2">{orderPrice}</p>
                          <CurrencyIcon type="primary" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.secondBlock}>
        <div className={styles.block}>
          <div className={styles.orderStats}>
            <div className={styles.orderColumns}>
              {renderOrderColumn('Готовы', doneOrders, true)}
              <span className="pl-8">{renderOrderColumn('В работе', pendingOrders)}</span>
            </div>
            <div className={styles.totalOrders}>
              <h2 className="text text_type_main-medium">Выполнено за все время:</h2>
              <p className="text text_type_digits-large">{total}</p>
            </div>
            <div className={styles.totalToday}>
              <h2 className="text text_type_main-medium">Выполнено за сегодня:</h2>
              <p className="text text_type_digits-large">{totalToday}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Feed;
