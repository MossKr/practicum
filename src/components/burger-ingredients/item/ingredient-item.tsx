import React from "react";
import { useDispatch } from "react-redux";
import { useDrag } from "react-dnd";
import { useNavigate, useLocation } from 'react-router-dom';
import { Ingredient } from "../../../utils/typesTs";
import { Counter, CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "../ingredients.module.css";
import { setCurrentIngredient } from "../../../services/currentIngredient/currentIngredientSlice";
import { AppDispatch } from '../../../services/store';

interface IngredientItemProps {
    item: Ingredient;
    count: number;
    onIngredientClick: (item: Ingredient) => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ item, count, onIngredientClick }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();

    const [{ isDragging }, dragRef] = useDrag({
        type: "ingredient",
        item: { ...item },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const handleIngredientClick = (): void => {
        dispatch(setCurrentIngredient(item));
        navigate(`/ingredients/${item._id}`, { state: { background: location } });
        onIngredientClick(item);
    };

    return (
        <div
            ref={dragRef}
            className={`${styles.ingredientItem} ${isDragging ? styles.dragging : ""}`}
            onClick={handleIngredientClick}
        >
            <div className={styles.imageContainer}>
                <img src={item.image} alt={item.name} className="mb-1 pr-4 pl-4" />
                {count > 0 && (
                    <div className={styles.counterWrapper}>
                        <Counter count={count} size="default" extraClass="m-1" />
                    </div>
                )}
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
    );
};

export default IngredientItem;
