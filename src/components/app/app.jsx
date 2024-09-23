import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingredients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
import { fetchIngredients, selectIngredients, selectIngredientsStatus, selectIngredientsError } from "../../services/ingredients/ingredientsSlice";

function App() {
    const dispatch = useDispatch();
    const ingredients = useSelector(selectIngredients);
    const status = useSelector(selectIngredientsStatus);
    const error = useSelector(selectIngredientsError);

    useEffect(() => {
        dispatch(fetchIngredients());
    }, [dispatch]);

    const isLoading = status === "loading";

    return (
        <>
            <AppHeader />
            <main>
                <section className={styles.container}>
                    <div className={`${styles.block} ${styles.firstBlock}`}>
                        <BurgerIngredients
                            ingredients={ingredients}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                    <div className={`${styles.block} ${styles.secondBlock}`}>
                        <BurgerConstructor
                            ingredients={ingredients}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                </section>
            </main>
        </>
    );
}

export default App;
