import React from "react";
import { useSelector } from 'react-redux';
import styles from "./styles.module.css";
import BurgerIngredients from "../components/burger-ingredients/burger-ingredients";
import BurgerConstructor from "../components/burger-constructor/burger-constructor";

function Home(): JSX.Element {
    const { isLoading, error } = useSelector((state: any) => state.ingredients);

    if (isLoading) {
        return <div className={styles.loading}>Загрузка ингредиентов...</div>;
    }

    if (error) {
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
