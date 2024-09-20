import React from "react";
import PropTypes from "prop-types";
import IngredientItem from "../item/ingredient-item";
import styles from "../ingredients.module.css";

function IngredientCategory(props) {
    let title = props.title;
    let items = props.items;
    let isVisible = props.isVisible !== undefined ? props.isVisible : true;

    if (!isVisible) {
        return null;
    }

    return (
        <>
            <h2 className={title === "Булки" ? "text text_type_main-medium" : "text text_type_main-medium pt-10"}>{title}</h2>
            <div className={styles.ingredientsList}>
                {items.map(function (item) {
                    return <IngredientItem key={item._id} item={item} />;
                })}
            </div>
        </>
    );
}

IngredientCategory.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            image: PropTypes.string.isRequired,
        })
    ).isRequired,
    isVisible: PropTypes.bool,
};

export default IngredientCategory;
