import { useSelector } from 'react-redux';
import { RootState } from '../services/store'; 

export interface Ingredient {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
}

export const useIngredients = () => {
  return useSelector((state: RootState) => state.ingredients.items);
};

export const getIngredientById = (ingredients: Ingredient[], id: string): Ingredient | undefined => {
  return ingredients.find(ingredient => ingredient._id === id);
};

export const calculateTotalPrice = (ingredients: Ingredient[], orderIngredients: string[]): number => {
  return orderIngredients.reduce((total, id) => {
    const ingredient = getIngredientById(ingredients, id);
    return total + (ingredient ? ingredient.price : 0);
  }, 0);
};
