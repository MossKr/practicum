import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrag } from "react-dnd";
import { useNavigate, useLocation } from 'react-router-dom';
import { IngredientType } from "../../../utils/types";
import { Counter, CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "../ingredients.module.css";
import { setCurrentIngredient } from "../../../services/currentIngredient/currentIngredientSlice";
import { selectBun, selectIngredients } from "../../../services/constructor/constructorSlice";

function IngredientItem({ item }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const bun = useSelector(selectBun);
    const ingredients = useSelector(selectIngredients);

    const [{ isDragging }, dragRef] = useDrag({
        type: "ingredient",
        item: { ...item },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const count = React.useMemo(() => {
        if (item.type === "bun") {
            return bun && bun._id === item._id ? 2 : 0;
        }
        return ingredients.filter(ing => ing._id === item._id).length;
    }, [item, bun, ingredients]);

    function handleIngredientClick() {
        dispatch(setCurrentIngredient(item));
        navigate(`/ingredients/${item._id}`, { state: { background: location } });
    }

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
}

IngredientItem.propTypes = {
    item: IngredientType.isRequired,
};

export default IngredientItem;
