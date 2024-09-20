import React from "react";
import PropTypes from "prop-types";
import { ConstructorElement, DragIcon, Button, CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./constructor.module.css";
import Modal from "../common/modal/modal";
import OrderDetails from "../order-details/order-details";

function BurgerConstructor(props) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    function openModal() {
        setIsModalOpen(true);
    }
    function closeModal() {
        setIsModalOpen(false);
    }
    function handleIngredientClick() {
        openModal();
    }

    if (props.isLoading) return <div>Загрузка...</div>;
    if (props.error) return <div>{props.error}</div>;

    var bun = props.ingredients.find(function (item) {
        return item.type === "bun";
    });

    var filling = props.ingredients.filter(function (item) {
        return item.type !== "bun";
    });

    return (
        <div className={`pt-25 ${styles.mainContainer}`}>
            <div className={styles.bunsAlign}>{bun && <ConstructorElement type="top" isLocked={true} text={bun.name + " (верх)"} price={bun.price} thumbnail={bun.image} />}</div>
            <div className={` ${styles.fillContainer} ${styles.customScroll}`}>
                {filling.map(function (item) {
                    return (
                        <div key={item._id} className={styles.ingredient}>
                            <DragIcon type="primary" />
                            <ConstructorElement text={item.name} price={item.price} thumbnail={item.image} />
                        </div>
                    );
                })}
            </div>
            <div className={styles.bunsAlign}>{bun && <ConstructorElement type="bottom" isLocked={true} text={bun.name + " (низ)"} price={bun.price} thumbnail={bun.image} />}</div>
            <div className={styles.orderElements}>
                <div className={`${styles.orderTotal} text text_type_digits-medium`}>
                    3586
                    <CurrencyIcon type="primary" className="pl-2" />
                </div>

                <div className={styles.orderButton}>
                    <Button htmlType="button" type="primary" size="large" onClick={handleIngredientClick}>
                        Оформить заказ
                    </Button>
                </div>
            </div>

            {isModalOpen && (
                <Modal title={" "} onClose={closeModal}>
                    <OrderDetails />
                </Modal>
            )}
        </div>
    );
}

BurgerConstructor.propTypes = {
    ingredients: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            proteins: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
            fat: PropTypes.number.isRequired,
            calories: PropTypes.number.isRequired,
            carbohydrates: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            image: PropTypes.string.isRequired,
            image_large: PropTypes.string.isRequired,
        })
    ).isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
};

export default BurgerConstructor;
