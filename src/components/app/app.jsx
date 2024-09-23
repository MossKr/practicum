import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./styles.module.css";
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingredients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
import { fetchIngredients } from "../../services/ingredients/ingredientsSlice";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchIngredients());
    }, [dispatch]);



    return (
        <>
            <AppHeader />
            <main>
                <section className={styles.container}>
                    <div className={`${styles.block} ${styles.firstBlock}`}>
                        <BurgerIngredients />
                    </div>
                    <div className={`${styles.block} ${styles.secondBlock}`}>
                        <BurgerConstructor />
                    </div>
                </section>
            </main>
        </>
    );
}

export default App;
