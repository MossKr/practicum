import React, { useMemo } from "react";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIngredients, selectIngredientsStatus } from "../../../services/ingredients/ingredientsSlice";
import { IngredientType } from "../../../utils/types";
import styles from "./details.module.css";

const IngredientDetails = React.memo(function IngredientDetails({ item: propItem }) {
    const { id } = useParams();
    const ingredients = useSelector(selectIngredients);
    const status = useSelector(selectIngredientsStatus);

    const item = useMemo(() => {
        if (propItem) return propItem;
        if (id) return ingredients.find(ingredient => ingredient._id === id);
        return null;
    }, [propItem, id, ingredients]);

    const details = useMemo(() => {
        if (!item) return [];
        return [
            { label: "Калории,ккал", value: item.calories },
            { label: "Белки,г", value: item.proteins },
            { label: "Жиры,г", value: item.fat },
            { label: "Углеводы,г", value: item.carbohydrates },
        ];
    }, [item]);

    if (!propItem && status === "loading") {
        return <div>Загрузка...</div>;
    }

    if (!propItem && status === "failed") {
        return <div>Произошла ошибка при загрузке данных</div>;
    }

    if (!item) {
        return <div>Ингредиент не найден</div>;
    }

    return (
        <div className={styles.modalBody}>
            <img src={item.image_large} alt={item.name} className={styles.largeImg} />
            <h3 className={`text text_type_main-medium mt-4 mb-8 ${styles.itemName}`}>{item.name}</h3>
            <dl className={styles.details}>
                {details.map(({ label, value }) => (
                    <div key={label} className={styles.detailItem}>
                        <dt className="text text_type_main-default text_color_inactive">{label}</dt>
                        <dd className="text text_type_digits-default text_color_inactive">{value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
});

IngredientDetails.propTypes = {
    item: IngredientType,
};

export default IngredientDetails;
