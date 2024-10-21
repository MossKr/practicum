import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IngredientDetails from '../components/burger-ingredients/details/ingredient-details';
import styles from './styles.module.css';

function IngredientPage() {
  const { id } = useParams();
  const ingredients = useSelector(state => state.ingredients.items);
  const ingredient = ingredients.find(item => item._id === id);

  if (!ingredient) {
    return <p>Ингредиент не найден</p>;
  }

  return (
    <div className={styles.container}>
      <IngredientDetails ingredient={ingredient} />
    </div>
  );
}

export default IngredientPage;
