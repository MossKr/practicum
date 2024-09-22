import React, { useState, useRef, useMemo } from "react";
import { IngredientType, LoadErrorPropTypes } from '../../utils/types';
import PropTypes from "prop-types";
import TabSort from "./tabs/tab-sort";
import IngredientCategory from "./categories/ingredient-category";
import styles from "./ingredients.module.css";

function BurgerIngredients({ ingredients, isLoading, error }) {
    const [activeTab, setActiveTab] = useState("buns");
    const bunsRef = useRef(null);
    const saucesRef = useRef(null);
    const mainsRef = useRef(null);

    const categoriesIngredients = useMemo(() => ({
        buns: ingredients.filter(item => item.type === "bun"),
        sauces: ingredients.filter(item => item.type === "sauce"),
        mains: ingredients.filter(item => item.type === "main")
    }), [ingredients]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        const refs = { buns: bunsRef, sauces: saucesRef, mains: mainsRef };
        refs[tab].current.scrollIntoView({ behavior: "smooth" });
    };

    if (isLoading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section>
            <h1 className="text text_type_main-large pt-10 pb-5">Соберите бургер</h1>
            <TabSort activeTab={activeTab} setActiveTab={handleTabClick} />
            <div className={styles.customScroll}>
                <div ref={bunsRef}>
                    <IngredientCategory title="Булки" items={categoriesIngredients.buns} />
                </div>
                <div ref={saucesRef}>
                    <IngredientCategory title="Соусы" items={categoriesIngredients.sauces} />
                </div>
                <div ref={mainsRef}>
                    <IngredientCategory title="Начинки" items={categoriesIngredients.mains} />
                </div>
            </div>
        </section>
    );
}

BurgerIngredients.propTypes = {
    ingredients: PropTypes.arrayOf(IngredientType).isRequired,
    ...LoadErrorPropTypes,
};

export default BurgerIngredients;
