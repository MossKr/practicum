import React from "react";
import styles from "./styles.module.css";
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingredients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";

const API_URL = "https://norma.nomoreparties.space/api";

function App() {
    const [ingredients, setIngredients] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(function () {
        function fetchIngredients() {
            fetch(`${API_URL}/ingredients`)
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error(`Ошибка: ${response.status}`);
                    }
                    return response.json();
                })
                .then(function (result) {
                    if (result.success) {
                        setIngredients(result.data);
                    }
                    setIsLoading(false);
                })
                .catch(function (e) {
                    setError(e.message);
                    setIsLoading(false);
                });
        }

        fetchIngredients();
    }, []);

    return (
        <>
            <AppHeader />
            <main>
                <section className={styles.container}>
                    <div className={`${styles.block} ${styles.firstBlock}`}>
                        <BurgerIngredients ingredients={ingredients} isLoading={isLoading} error={error} />
                    </div>
                    <div className={`${styles.block} ${styles.secondBlock}`}>
                        <BurgerConstructor ingredients={ingredients} isLoading={isLoading} error={error} />
                    </div>
                </section>
            </main>
        </>
    );
}

export default App;
