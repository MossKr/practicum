import React, { useState, useRef, useMemo} from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { useNavigate, useLocation } from 'react-router-dom';
import { selectIngredients, selectIngredientsStatus, selectIngredientsError } from "../../services/ingredients/ingredientsSlice";
import { setCurrentIngredient } from "../../services/currentIngredient/currentIngredientSlice";
import { selectConstructorItems } from "../../services/constructor/constructorSlice";
import TabSort from "./tabs/tab-sort";
import IngredientCategory from "./categories/ingredient-category";
import styles from "./ingredients.module.css";
import { Ingredient } from "../../utils/typesTs";

interface CategoryRefs {
    [key: string]: React.RefObject<HTMLDivElement>;
}

interface CategorizedIngredients {
    buns: Ingredient[];
    sauces: Ingredient[];
    mains: Ingredient[];
}

interface IngredientCounts {
    [key: string]: number;
}

interface ConstructorItems {
    bun: Ingredient | null;
    ingredients: Ingredient[];
}

function BurgerIngredients(): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();


    const ingredients = useAppSelector(selectIngredients);
    const status = useAppSelector(selectIngredientsStatus);
    const error = useAppSelector(selectIngredientsError);
    const constructorItems: ConstructorItems = useAppSelector(selectConstructorItems);

    const [activeTab, setActiveTab] = useState<"buns" | "sauces" | "mains">("buns");

    const bunsRef = useRef<HTMLDivElement>(null);
    const saucesRef = useRef<HTMLDivElement>(null);
    const mainsRef = useRef<HTMLDivElement>(null);

    const categoriesIngredients = useMemo<CategorizedIngredients>(() => {
        if (!ingredients || ingredients.length === 0) {
            return { buns: [], sauces: [], mains: [] };
        }
        return {
            buns: ingredients.filter((item: Ingredient) => item.type === "bun"),
            sauces: ingredients.filter((item: Ingredient) => item.type === "sauce"),
            mains: ingredients.filter((item: Ingredient) => item.type === "main"),
        };
    }, [ingredients]);

    const ingredientCounts = useMemo<IngredientCounts>(() => {
        const counts: IngredientCounts = {};
        if (constructorItems && constructorItems.bun) {
            counts[constructorItems.bun._id] = 2;
        }
        if (constructorItems && constructorItems.ingredients) {
            constructorItems.ingredients.forEach((item: Ingredient) => {
                counts[item._id] = (counts[item._id] || 0) + 1;
            });
        }
        return counts;
    }, [constructorItems]);

    const handleTabClick = (tab: "buns" | "sauces" | "mains"): void => {
        setActiveTab(tab);
        const refs: CategoryRefs = { buns: bunsRef, sauces: saucesRef, mains: mainsRef };
        refs[tab].current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleIngredientClick = (ingredient: Ingredient): void => {
        // @ts-ignore
        dispatch(setCurrentIngredient(ingredient));
        navigate(`/ingredients/${ingredient._id}`, { state: { background: location } });
    };

    if (status === "loading") {
        return <div>Загрузка...</div>;
    }

    if (status === "failed") {
        return <div>Ошибка: {error}</div>;
    }

    return (
    <section data-testid="ingredients-container">
      <h1 className="text text_type_main-large pt-10 pb-5">Соберите бургер</h1>
      <TabSort activeTab={activeTab} setActiveTab={handleTabClick} />
      <div className={styles.customScroll}>
        <div ref={bunsRef}>
          <IngredientCategory
            title="Булки"
            items={categoriesIngredients.buns}
            onIngredientClick={handleIngredientClick}
            ingredientCounts={ingredientCounts}
          />
        </div>
        <div ref={saucesRef}>
          <IngredientCategory
            title="Соусы"
            items={categoriesIngredients.sauces}
            onIngredientClick={handleIngredientClick}
            ingredientCounts={ingredientCounts}
          />
        </div>
        <div ref={mainsRef}>
          <IngredientCategory
            title="Начинки"
            items={categoriesIngredients.mains}
            onIngredientClick={handleIngredientClick}
            ingredientCounts={ingredientCounts}
          />
        </div>
      </div>
    </section>
  );
}

export default BurgerIngredients;
