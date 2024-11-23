import React, { useMemo } from "react";
import { useAppSelector } from "../../hooks/redux";
import { useParams } from "react-router-dom";
import styles from "./order-details.module.css";
import img from "../../assets/images/check.svg";
import Preloader from "../common/preloader/preloader";
import { selectOrderNumber, selectOrderStatus, selectOrderError } from "../../services/order/orderSlice";

export interface Order {
  id: string;
  number: string;
  name: string;
  status: string;
  ingredients: string[];
}

interface OrderDetailsProps {
  isFullPage?: boolean;
  order?: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  isFullPage = false,
  order
}) => {
    const { id } = useParams<{ id: string }>();
    const orderNumber = useAppSelector((state) => selectOrderNumber(state));
    const status = useAppSelector((state) => selectOrderStatus(state));
    const error = useAppSelector((state) => selectOrderError(state));

    const content = useMemo(() => {
        switch (status) {
            case "loading":
                return (
                    <div className={styles.modalBody}>
                        <Preloader />
                    </div>
                );
            case "failed":
                return (
                    <div className={styles.modalBody}>
                        <p className="text text_type_main-large">Ошибка: {error}</p>
                    </div>
                );
            case "succeeded":
                return (
                    <div className={`${styles.modalBody} ${isFullPage ? styles.fullPage : ''}`} data-testid="order-details">
                        {isFullPage && <h1>Детали заказа</h1>}
                        <p className={`${styles.numberOrder} text text_type_digits-large`} data-testid="order-number">
                            {orderNumber || order?.number || id}
                        </p>
                        <p className="text text_type_main-medium mt-10">
                            {isFullPage ? 'Номер заказа' : 'идентификатор заказа'}
                        </p>
                        {!isFullPage && (
                            <>
                                <img src={img} alt="Заказ принят" className="mt-10" />
                                <p className="text text_type_main-default mt-10">
                                    Ваш заказ начали готовить
                                </p>
                                <p className="text text_type_main-default text_color_inactive mt-2">
                                    Дождитесь готовности на орбитальной станции
                                </p>
                            </>
                        )}
                        {isFullPage && (
                            <>
                                <p className="text text_type_main-default mt-10">
                                    Статус: {order?.status || 'Загрузка...'}
                                </p>
                                <div className="mt-10">
                                    <p className="text text_type_main-medium">Состав:</p>
                                    {order?.ingredients?.map((ingredient, index) => (
                                        <p key={index} className="text text_type_main-default">
                                            {ingredient}
                                        </p>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                );
            default:
                return null;
        }
    }, [status, orderNumber, error, order, id, isFullPage]);

    return content;
};

export default React.memo(OrderDetails);
