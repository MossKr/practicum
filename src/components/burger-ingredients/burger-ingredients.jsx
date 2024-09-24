import React, { useState, useRef, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIngredients, selectIngredients, selectIngredientsStatus, selectIngredientsError } from "../../services/ingredients/ingredientsSlice";
import { setCurrentIngredient } from "../../services/currentIngredient/currentIngredientSlice";
import { selectConstructorItems } from "../../services/constructor/constructorSlice";
import TabSort from "./tabs/tab-sort";
import IngredientCategory from "./categories/ingredient-category";
import styles from "./ingredients.module.css";

function BurgerIngredients() {
    const dispatch = useDispatch();
    const ingredients = useSelector(selectIngredients);
    const status = useSelector(selectIngredientsStatus);
    const error = useSelector(selectIngredientsError);
    const constructorItems = useSelector(selectConstructorItems);

    const [activeTab, setActiveTab] = useState("buns");
    const bunsRef = useRef(null);
    const saucesRef = useRef(null);
    const mainsRef = useRef(null);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchIngredients());
        }
    }, [status, dispatch]);

    const categoriesIngredients = useMemo(() => {
        if (!ingredients || ingredients.length === 0) {
            return { buns: [], sauces: [], mains: [] };
        }
        return {
            buns: ingredients.filter((item) => item.type === "bun"),
            sauces: ingredients.filter((item) => item.type === "sauce"),
            mains: ingredients.filter((item) => item.type === "main"),
        };
    }, [ingredients]);

    const ingredientCounts = useMemo(() => {
        const counts = {};
        if (constructorItems && constructorItems.bun) {
            counts[constructorItems.bun._id] = 2;
        }
        if (constructorItems && constructorItems.ingredients) {
            constructorItems.ingredients.forEach((item) => {
                counts[item._id] = (counts[item._id] || 0) + 1;
            });
        }
        return counts;
    }, [constructorItems]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        const refs = { buns: bunsRef, sauces: saucesRef, mains: mainsRef };
        refs[tab].current.scrollIntoView({ behavior: "smooth" });
    };

    const handleIngredientClick = (ingredient) => {
        dispatch(setCurrentIngredient(ingredient));
    };

    if (status === "loading") {
        return <div>Загрузка...</div>;
    }

    if (status === "failed") {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <section>
            <h1 className="text text_type_main-large pt-10 pb-5">Соберите бургер</h1>
            <TabSort activeTab={activeTab} setActiveTab={handleTabClick} />
            <div className={styles.customScroll}>
                <div ref={bunsRef}>
                    <IngredientCategory title="Булки" items={categoriesIngredients.buns} onIngredientClick={handleIngredientClick} ingredientCounts={ingredientCounts} />
                </div>
                <div ref={saucesRef}>
                    <IngredientCategory title="Соусы" items={categoriesIngredients.sauces} onIngredientClick={handleIngredientClick} ingredientCounts={ingredientCounts} />
                </div>
                <div ref={mainsRef}>
                    <IngredientCategory title="Начинки" items={categoriesIngredients.mains} onIngredientClick={handleIngredientClick} ingredientCounts={ingredientCounts} />
                </div>
            </div>
        </section>
    );
}

export default BurgerIngredients;
