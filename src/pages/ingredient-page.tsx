import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IngredientDetails from '../components/burger-ingredients/details/ingredient-details';
import styles from './styles.module.css';
import { Ingredient } from '../utils/typesTs';
import { selectIngredients, selectIngredientsStatus } from "../services/ingredients/ingredientsSlice";

function IngredientPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  // @ts-ignore
  const ingredients = useSelector(selectIngredients);
  // @ts-ignore
  const status = useSelector(selectIngredientsStatus);

  if (status === "loading") {
    return <div>Загрузка...</div>;
  }

  if (status === "failed") {
    return <div>Произошла ошибка при загрузке данных</div>;
  }

  const ingredient = ingredients.find((item: Ingredient) => item._id === id);

  if (!ingredient) {
    return <div>Ингредиент не найден</div>;
  }

  return (
    <div className={styles.container}>
      <IngredientDetails item={ingredient} />
    </div>
  );
}

export default IngredientPage;
