import React, { useState, useEffect, useCallback } from "react";
import styles from "./styles.module.css";
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingredients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";

const API_URL = "https://norma.nomoreparties.space/api";

function App() {
    const [ingredients, setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchIngredients = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/ingredients`);
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                setIngredients(result.data);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

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
