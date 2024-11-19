import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IngredientDetails from '../components/burger-ingredients/details/ingredient-details';
import styles from './styles.module.css';
import { Ingredient } from '../utils/typesTs';
import { selectIngredients, selectIngredientsStatus } from "../services/ingredients/ingredientsSlice";
import { RootState } from '../services/store';

function IngredientPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector((state: RootState) => selectIngredients(state));
  const status = useSelector((state: RootState) => selectIngredientsStatus(state));

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
    <div className={styles.container}>ы
      <IngredientDetails item={ingredient} />
    </div>
  );
}

export default IngredientPage;
