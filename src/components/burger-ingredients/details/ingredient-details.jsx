import React from "react";
import PropTypes from "prop-types";
import styles from "./details.module.css";

function IngredientDetails({ item }) {
    const details = [
        { label: "Калории,ккал.", value: item.calories },
        { label: "Белки,г.", value: item.proteins },
        { label: "Жиры,г.", value: item.fat },
        { label: "Углеводы,г.", value: item.carbohydrates },
    ];

    const textTitleName = "text text_type_main-default text_color_inactive";
    const textDetails = "text text_type_digits-default text_color_inactive";

    return (
        <div className={styles.modalBody}>
            <img src={item.image_large} alt={item.name} className={styles.largeImg} />
            <h3 className={`text text_type_main-medium mt-4 mb-8 ${styles.itemName}`}>{item.name}</h3>
            <div className={styles.details}>
                {details.map(({ label, value }) => (
                    <span key={label}>
                        <p className={textTitleName}>{label}</p>
                        <p className={textDetails}>{value}</p>
                    </span>
                ))}
            </div>
        </div>
    );
}

IngredientDetails.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        image_large: PropTypes.string.isRequired,
        calories: PropTypes.number.isRequired,
        proteins: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        carbohydrates: PropTypes.number.isRequired,
    }).isRequired,
};

export default IngredientDetails;
