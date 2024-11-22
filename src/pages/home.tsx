import React from "react";
import { useAppSelector } from "../hooks/redux";
import { selectIngredientsStatus, selectIngredientsError } from "../services/ingredients/ingredientsSlice";
import styles from "./styles.module.css";
import BurgerIngredients from "../components/burger-ingredients/burger-ingredients";
import BurgerConstructor from "../components/burger-constructor/burger-constructor";

function Home(): JSX.Element {
    const status = useAppSelector(selectIngredientsStatus);
    const error = useAppSelector(selectIngredientsError);

    if (status === 'loading') {
        return <div className={styles.loading}>Загрузка ингредиентов...</div>;
    }

    if (status === 'failed') {
        return <div className={styles.error}>Ошибка: {error}</div>;
    }

    return (
        <main className={styles.main}>
            <section className={styles.container}>
                <div className={`${styles.block} ${styles.firstBlock}`}>
                    <BurgerIngredients />
                </div>
                <div className={`${styles.block} ${styles.secondBlock}`}>
                    <BurgerConstructor />
                </div>
            </section>
        </main>
    );
}

export default Home;
