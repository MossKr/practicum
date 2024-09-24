import React from "react";
import { IngredientType } from "../../../utils/types";
import PropTypes from "prop-types";
import IngredientItem from "../item/ingredient-item";
import styles from "../ingredients.module.css";

const IngredientCategory = React.memo(function IngredientCategory({
    title,
    items,
    isVisible = true,
    onIngredientClick,
    ingredientCounts
}) {
    if (!isVisible) {
        return null;
    }

    const titleClassName = `text text_type_main-medium ${title !== "Булки" ? "pt-10" : ""}`;

    return (
        <>
            <h2 className={titleClassName}>{title}</h2>
            <ul className={`${styles.ingredientsList} ${styles.noListMarker}`}>
                {items.map((item) => (
                    <li key={item._id}>
                        <IngredientItem
                            item={item}
                            onClick={() => onIngredientClick(item)}
                            count={ingredientCounts[item._id] || 0}
                        />
                    </li>
                ))}
            </ul>
        </>
    );
});

IngredientCategory.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(IngredientType).isRequired,
    isVisible: PropTypes.bool,
    onIngredientClick: PropTypes.func.isRequired,
    ingredientCounts: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default IngredientCategory;
