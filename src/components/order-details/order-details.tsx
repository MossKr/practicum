import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "./order-details.module.css";
import img from "../../assets/images/check.svg";
import Preloader from "../common/preloader/preloader";

interface OrderState {
    orderNumber: number | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface RootState {
    order: OrderState;
}

const OrderDetails: React.FC = () => {
    const { orderNumber, status, error } = useSelector((state: RootState) => state.order);

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
                    <div className={styles.modalBody}>
                        <p className={`${styles.numberOrder} text text_type_digits-large`}>
                            {orderNumber}
                        </p>
                        <p className="text text_type_main-medium mt-10">
                            идентификатор заказа
                        </p>
                        <img src={img} alt="Заказ принят" className="mt-10" />
                        <p className="text text_type_main-default mt-10">
                            Ваш заказ начали готовить
                        </p>
                        <p className="text text_type_main-default text_color_inactive mt-2">
                            Дождитесь готовности на орбитальной станции
                        </p>
                    </div>
                );
            default:
                return null;
        }
    }, [status, orderNumber, error]);

    return content;
};

export default React.memo(OrderDetails);
