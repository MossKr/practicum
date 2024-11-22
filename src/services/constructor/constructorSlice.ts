import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { Ingredient, ConstructorIngredient } from '../../utils/typesTs';

interface ConstructorState {
  bun: Ingredient | null;
  ingredients: ConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: "lego",
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<Ingredient>) => {
      if (action.payload.type === "bun") {
        state.bun = action.payload;
      } else {
        state.ingredients.push({...action.payload, uniqueId: uuidv4()});
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.uniqueId !== action.payload);
    },
    moveIngredient: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragItem = state.ingredients[dragIndex];
      const newIngredients = [...state.ingredients];
      newIngredients.splice(dragIndex, 1);
      newIngredients.splice(hoverIndex, 0, dragItem);
      state.ingredients = newIngredients;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const { removeIngredient, moveIngredient, clearConstructor } = constructorSlice.actions;

export const addIngredient = (ingredient: Ingredient) => {
    if (ingredient.type === "bun") {
      return constructorSlice.actions.addIngredient(ingredient);
    } else {
      return constructorSlice.actions.addIngredient(ingredient);
    }
  };

export const selectBun = (state: { lego: ConstructorState }): Ingredient | null => state.lego.bun;
export const selectIngredients = (state: { lego: ConstructorState }): ConstructorIngredient[] => state.lego.ingredients;

export const selectConstructorItems = createSelector(
  [selectBun, selectIngredients],
  (bun, ingredients): ConstructorState => ({
    bun,
    ingredients,
  })
);

export const selectTotalPrice = createSelector([selectBun, selectIngredients], (bun, ingredients): number => {
  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
  return bunPrice + ingredientsPrice;
});

export default constructorSlice.reducer;
