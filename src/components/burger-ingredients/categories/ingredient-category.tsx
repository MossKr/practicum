import React from "react";
import { Ingredient } from "../../../utils/typesTs";
import IngredientItem from "../item/ingredient-item";
import styles from "../ingredients.module.css";

interface IngredientCategoryProps {
    title: string;
    items: Ingredient[];
    isVisible?: boolean;
    onIngredientClick: (item: Ingredient) => void;
    ingredientCounts: Record<string, number>;
}

const IngredientCategory: React.FC<IngredientCategoryProps> = React.memo(({
    title,
    items,
    isVisible = true,
    onIngredientClick,
    ingredientCounts
}) => {
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
                            onIngredientClick={onIngredientClick}
                            count={ingredientCounts[item._id] || 0}
                        />
                    </li>
                ))}
            </ul>
        </>
    );
});

IngredientCategory.displayName = 'IngredientCategory';

export default IngredientCategory;
