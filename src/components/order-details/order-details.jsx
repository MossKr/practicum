import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./order-details.module.css";
import img from "../../assets/images/check.svg";
import Preloader from "../common/preloader/preloader"; 

function OrderDetails() {
    const { orderNumber, status, error } = useSelector(state => state.order);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let timer;
        if (status === "succeeded" || status === "failed") {
            timer = setTimeout(() => {
                setIsLoading(false);
            }, 50);
        }
        return () => clearTimeout(timer);
    }, [status]);

    if (isLoading) {
        return (
            <div className={styles.modalBody}>
                <Preloader />
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className={styles.modalBody}>
                <p className="text text_type_main-large">Ошибка: {error}</p>
            </div>
        );
    }

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
}

export default React.memo(OrderDetails);
