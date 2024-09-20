import React from "react";
import PropTypes from "prop-types";
import { Counter, CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "../ingredients.module.css";
import Modal from "../../common/modal/modal";
import IngredientDetails from "../details/ingredient-details";

function IngredientItem(props) {
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
    return (
        <>
            <div className={`${styles.ingredientItem}`} onClick={handleIngredientClick}>
                <div className={styles.imageContainer}>
                    <img src={props.item.image} alt={props.item.name} className="mb-1 pr-4 pl-4" />

                    <div className={styles.counterWrapper}>
                        <Counter count={1} size="default" extraClass="m-1" />
                    </div>
                </div>

                <span className={styles.price}>
                    <p className={`${styles.moneyIcon} text text_type_digits-default mb-1`}>
                        {props.item.price} <CurrencyIcon type="primary" />
                    </p>
                </span>
                <span className={styles.price}>
                    <p className="text text_type_main-default">{props.item.name}</p>
                </span>
            </div>

            {isModalOpen && (
                <Modal title="Детали ингредиента" onClose={closeModal}>
                    <IngredientDetails item={props.item} />
                </Modal>
            )}
        </>
    );
}

IngredientItem.propTypes = {
    item: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        image_large: PropTypes.string.isRequired,
        calories: PropTypes.number.isRequired,
        proteins: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        carbohydrates: PropTypes.number.isRequired,
    }).isRequired,
};

export default IngredientItem;
