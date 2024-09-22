import React, { useMemo, useCallback } from "react";
import { IngredientType, LoadErrorPropTypes } from '../../utils/types';
import PropTypes from "prop-types";
import { ConstructorElement, DragIcon, Button, CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./constructor.module.css";
import Modal from "../common/modal/modal";
import OrderDetails from "../order-details/order-details";
import { useModal } from "../../hooks/useModal";

function BurgerConstructor({ ingredients, isLoading, error }) {
    const { isModalOpen, openModal, closeModal } = useModal();

    const handleOrderClick = useCallback(() => {
        openModal();
    }, [openModal]);

    const { bun, filling, totalPrice } = useMemo(() => {
        const bun = ingredients.find((item) => item.type === "bun");
        const filling = ingredients.filter((item) => item.type !== "bun");
        const totalPrice = (bun ? bun.price * 2 : 0) + filling.reduce((sum, item) => sum + item.price, 0);
        return { bun, filling, totalPrice };
    }, [ingredients]);

    if (isLoading) return <div className={styles.message}>Загрузка...</div>;
    if (error) return <div className={styles.message}>{error}</div>;

    return (
        <div className={`pt-25 ${styles.mainContainer}`}>
            <div className={styles.bunsAlign}>
                {bun && <ConstructorElement type="top" isLocked={true} text={`${bun.name} (верх)`} price={bun.price} thumbnail={bun.image} />}
            </div>
            <div className={`${styles.fillContainer} ${styles.customScroll}`}>
                {filling.map((item) => (
                    <div key={item._id} className={styles.ingredient}>
                        <DragIcon type="primary" />
                        <ConstructorElement text={item.name} price={item.price} thumbnail={item.image} />
                    </div>
                ))}
            </div>
            <div className={styles.bunsAlign}>
                {bun && <ConstructorElement type="bottom" isLocked={true} text={`${bun.name} (низ)`} price={bun.price} thumbnail={bun.image} />}
            </div>
            <div className={styles.orderElements}>
                <div className={`${styles.orderTotal} text text_type_digits-medium`}>
                    {totalPrice}
                    <CurrencyIcon type="primary" className="pl-2" />
                </div>

                <div className={styles.orderButton}>
                    <Button htmlType="button" type="primary" size="large" onClick={handleOrderClick}>
                        Оформить заказ
                    </Button>
                </div>
            </div>

            {isModalOpen && (
                <Modal title={" "} isOpen={isModalOpen} onClose={closeModal}>
                    <OrderDetails />
                </Modal>
            )}
        </div>
    );
}

BurgerConstructor.propTypes = {
    ingredients: PropTypes.arrayOf(IngredientType).isRequired,
    ...LoadErrorPropTypes,
};

export default React.memo(BurgerConstructor);
