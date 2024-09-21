import React from "react";
import { IngredientType } from '../../../utils/types';
import { Counter, CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "../ingredients.module.css";
import Modal from "../../common/modal/modal";
import IngredientDetails from "../details/ingredient-details";
import { useModal } from "../../../hooks/useModal";

function IngredientItem({ item }) {
    const { isModalOpen, openModal, closeModal } = useModal();

    function handleIngredientClick() {
        openModal();
    }

    return (
        <>
            <div className={styles.ingredientItem} onClick={handleIngredientClick}>
                <div className={styles.imageContainer}>
                    <img src={item.image} alt={item.name} className="mb-1 pr-4 pl-4" />
                    <div className={styles.counterWrapper}>
                        <Counter count={1} size="default" extraClass="m-1" />
                    </div>
                </div>
                <span className={styles.price}>
                    <p className={`${styles.moneyIcon} text text_type_digits-default mb-1`}>
                        {item.price} <CurrencyIcon type="primary" />
                    </p>
                </span>
                <span className={styles.price}>
                    <p className="text text_type_main-default">{item.name}</p>
                </span>
            </div>

            {isModalOpen && (
                <Modal title="Детали ингредиента" isOpen={isModalOpen} onClose={closeModal}>
                    <IngredientDetails item={item} />
                </Modal>
            )}
        </>
    );
}

IngredientItem.propTypes = {
    item: IngredientType.isRequired,
};

export default IngredientItem;
