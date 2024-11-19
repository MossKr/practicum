import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ingredient } from '../../utils/typesTs';

interface CurrentIngredientState {
  ingredient: Ingredient | null;
}

const initialState: CurrentIngredientState = {
  ingredient: null,
};

const currentIngredientSlice = createSlice({
  name: "currentIngredient",
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<Ingredient>) => {
      state.ingredient = action.payload;
    },
    clearCurrentIngredient: (state) => {
      state.ingredient = null;
    },
  },
});

export const { setCurrentIngredient, clearCurrentIngredient } = currentIngredientSlice.actions;

export const selectCurrentIngredient = (state: { currentIngredient: CurrentIngredientState }): Ingredient | null =>
  state.currentIngredient.ingredient;

export const selectCurrentIngredientName = (state: { currentIngredient: CurrentIngredientState }): string | undefined =>
  state.currentIngredient.ingredient?.name;

export const selectCurrentIngredientPrice = (state: { currentIngredient: CurrentIngredientState }): number | undefined =>
  state.currentIngredient.ingredient?.price;

export const selectCurrentIngredientImage = (state: { currentIngredient: CurrentIngredientState }): string | undefined =>
  state.currentIngredient.ingredient?.image;

export default currentIngredientSlice.reducer;
