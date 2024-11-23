import React, { useMemo } from "react";
import { useParams } from 'react-router-dom';
import { useAppSelector } from "../../../hooks/redux";
import { selectIngredients, selectIngredientsStatus } from "../../../services/ingredients/ingredientsSlice";
import { Ingredient } from "../../../utils/typesTs";
import styles from "./details.module.css";

interface IngredientDetailsProps {
    item?: Ingredient;
}

interface DetailItem {
    label: string;
    value: number;
}

const IngredientDetails: React.FC<IngredientDetailsProps> = React.memo(({ item: propItem }) => {
    const { id } = useParams<{ id: string }>();
    const ingredients = useAppSelector((state) => selectIngredients(state));
    const status = useAppSelector((state) => selectIngredientsStatus(state));

    const item = useMemo(() => {
        if (propItem) return propItem;
        if (id) return ingredients.find((ingredient: Ingredient) => ingredient._id === id);
        return null;
    }, [propItem, id, ingredients]);

    const details = useMemo((): DetailItem[] => {
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
        <div className={styles.modalBody} data-testid="ingredient-details">
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

IngredientDetails.displayName = 'IngredientDetails';

export default IngredientDetails;
