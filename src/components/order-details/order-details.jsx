import React from "react";
import styles from "./order-details.module.css";
import img from "../../assets/images/check.svg";

function OrderDetails() {
    return (
        <div className={styles.modalBody}>
            <p className={`${styles.numberOrder} text text_type_digits-large`}>
               456123
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
