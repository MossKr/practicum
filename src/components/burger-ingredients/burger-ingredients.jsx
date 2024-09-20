import React from "react";
import PropTypes from "prop-types";
import TabSort from "./tabs/tab-sort";
import IngredientCategory from "./categories/ingredient-category";
import styles from "./ingredients.module.css";

function BurgerIngredients(props) {
    const [tab, setTab] = React.useState("buns");
    const bunsRef = React.useRef(null);
    const saucesRef = React.useRef(null);
    const mainsRef = React.useRef(null);

    const buns = React.useMemo(() => props.ingredients.filter((item) => item.type === "bun"), [props.ingredients]);
    const sauces = React.useMemo(() => props.ingredients.filter((item) => item.type === "sauce"), [props.ingredients]);
    const mains = React.useMemo(() => props.ingredients.filter((item) => item.type === "main"), [props.ingredients]);

    if (props.isLoading) return <div>Загрузка... </div>;
    if (props.error) return <div>{props.error}</div>;

    function onClick(openTab) {
        setTab(openTab);
        if (openTab === "buns") {
            bunsRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (openTab === "sauces") {
            saucesRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (openTab === "mains") {
            mainsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <section>
            <h1 className="text text_type_main-large pt-10 pb-5">Соберите бургер</h1>
            <TabSort activeTab={tab} setActiveTab={onClick} />
            <div className={styles.customScroll}>
                <div ref={bunsRef}>
                    <IngredientCategory title="Булки" items={buns} />
                </div>
                <div ref={saucesRef}>
                    <IngredientCategory title="Соусы" items={sauces} />
                </div>
                <div ref={mainsRef}>
                    <IngredientCategory title="Начинки" items={mains} />
                </div>
            </div>
        </section>
    );
}

BurgerIngredients.propTypes = {
    ingredients: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            type: PropTypes.oneOf(["bun", "sauce", "main"]).isRequired,
            proteins: PropTypes.number.isRequired,
            calories: PropTypes.number.isRequired,
            fat: PropTypes.number.isRequired,
            carbohydrates: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            image: PropTypes.string.isRequired,
            image_large: PropTypes.string.isRequired,
        })
    ).isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
};

export default BurgerIngredients;
