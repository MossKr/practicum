import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  CurrencyIcon,
  FormattedDate
} from '@ya.praktikum/react-developer-burger-ui-components';
import Modal from '../../components/common/modal/modal';
import OrderDetails from '../../components/order-details/order-details';
import {
  selectProfileOrders,
  selectProfileOrdersConnectionStatus,
  selectProfileOrdersError,
  wsConnecting,
  wsDisconnect,
  ProfileOrder,
} from '../../services/feed/profileOrdersSlice';
import { selectIsAuthenticated } from '../../services/auth/authSlice';
import styles from './profile-orders.module.css';
import Preloader from '../../components/common/preloader/preloader';
import { useIngredients, getIngredientById, calculateTotalPrice } from '../../utils/ingredients';

const WEBSOCKET_URL = 'wss://norma.nomoreparties.space/orders';
const LOADING_TIMEOUT = 5000;

const ProfileOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const orders = useAppSelector(selectProfileOrders);
  const connectionStatus = useAppSelector(selectProfileOrdersConnectionStatus);
  const error = useAppSelector(selectProfileOrdersError);
  const ingredients = useIngredients();

  const hasConnected = useRef(false);

  const connectWebSocket = useCallback(() => {
    const token = Cookies.get('accessToken');
    if (token && !hasConnected.current) {
      const extractedToken = token.replace('Bearer ', '');
      dispatch(wsConnecting({ url: WEBSOCKET_URL, token: extractedToken }));
      hasConnected.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && !hasConnected.current) {
      connectWebSocket();
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_TIMEOUT);

    return () => {
      clearTimeout(timer);
      if (hasConnected.current) {
        dispatch(wsDisconnect());
        hasConnected.current = false;
      }
    };
  }, [dispatch, connectWebSocket, isAuthenticated]);

  useEffect(() => {
    if (connectionStatus === 'connected') {
      setIsLoading(false);
    }
  }, [connectionStatus]);

  if (connectionStatus === 'error') {
    return (
      <div className={styles.errorContainer}>
        <h2 className='text text_type_main-medium'>Ошибка подключения</h2>
        <p className='text text_type_main-default text_color_inactive'>{error}</p>
      </div>
    );
  }


  const handleOrderClick = (orderId: string) => {
    navigate(`/profile/orders/${orderId}`, {
      state: { background: location }
    });
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'done': return 'Выполнен';
      case 'pending': return 'Готовится';
      case 'created': return 'Создан';
      default: return status;
    }
  };

  const getOrderStatusClass = (status: string) => {
    switch (status) {
      case 'done': return styles.statusDone;
      case 'pending': return styles.statusPending;
      case 'created': return styles.statusCreated;
      default: return '';
    }
  };

  return (
     <div className={styles.profileOrdersContainer}>
       {isLoading ? (
         <Preloader />
       ) : orders.length === 0 ? (
         <div className={styles.noOrdersMessage}>
           <p className='text text_type_main-medium'>У вас пока нет заказов</p>
           <p className='text text_type_main-default text_color_inactive mt-2'>
             Когда вы сделаете свой первый заказ, он появится здесь
           </p>
         </div>
       ) : (
         <div className={styles.scrollableContainer}>
           <div className={styles.orderList}>
             {orders.map((order: ProfileOrder) => (
              <div
                key={order._id}
                className={`${styles.orderCard}`}
                onClick={() => handleOrderClick(order._id)}
              >
                  <div className={styles.orderHeader}>
                    <p className='text text_type_digits-medium'>#{order.number}</p>
                    <FormattedDate
                      date={new Date(order.createdAt)}
                      className='text text_type_main-default text_color_inactive'
                    />
                  </div>
                  <h2 className={`${styles.orderName} text text_type_main-medium mt-6`}>
                    {(order as any).name}
                  </h2>
                  <p className={`${styles.orderStatus} ${getOrderStatusClass(order.status)} text text_type_main-default mt-2`}>
                    {getOrderStatusText(order.status)}
                  </p>
                  <div className={`${styles.orderContent} mt-6`}>
                    <div className={styles.ingredientImages}>
                      {order.ingredients.slice(0, 6).map((ingredientId, index) => {
                        const ingredient = getIngredientById(ingredients, ingredientId);
                        return (
                          <div
                            key={index}
                            className={styles.ingredientImage}

                          >
                            {ingredient && (
                              <img src={ingredient.image_mobile} alt={ingredient.name} />
                            )}
                          </div>
                        );
                      })}
                      {order.ingredients.length > 6 && (
                        <div
                          className={`${styles.ingredientImage} ${styles.moreIngredients}`}
                          style={{zIndex: 1}}
                        >
                          <span className='text text_type_main-default'>+{order.ingredients.length - 6}</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.orderPrice}>
                      <span className='text text_type_digits-default mr-2'>
                        {calculateTotalPrice(ingredients, order.ingredients)}
                      </span>
                      <CurrencyIcon type='primary' />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {background && (
          <Routes>
            <Route
              path=':id'
              element={
                <Modal
                  isOpen={true}
                  onClose={() => navigate('/profile/orders')}
                  title='Детали заказа'
                >
                  <OrderDetails />
                </Modal>
              }
            />
          </Routes>
        )}
      </div>
    );
  };

  export default ProfileOrders;
