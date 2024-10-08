import React, { useMemo } from "react";
import { IngredientType } from "../../../utils/types";
import styles from "./details.module.css";

const IngredientDetails = React.memo(function IngredientDetails({ item }) {
    const details = useMemo(() => [
        { label: "Калории,ккал", value: item.calories },
        { label: "Белки,г", value: item.proteins },
        { label: "Жиры,г", value: item.fat },
        { label: "Углеводы,г", value: item.carbohydrates },
    ], [item]);

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
    item: IngredientType.isRequired,
};

export default IngredientDetails;
