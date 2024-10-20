import { createSlice } from "@reduxjs/toolkit";

const currentIngredientSlice = createSlice({
    name: "currentIngredient",
    initialState: {
        ingredient: null,
    },
    reducers: {
        setCurrentIngredient: (state, action) => {
            //сохраняем
            state.ingredient = action.payload;
        },
        clearCurrentIngredient: (state) => {
            //забываем  CHECKED
            state.ingredient = null;
        },
    },
});

export const { setCurrentIngredient, clearCurrentIngredient } = currentIngredientSlice.actions;

export const selectCurrentIngredient = (state) => state.currentIngredient.ingredient;

export const selectCurrentIngredientName = (state) => state.currentIngredient.ingredient?.name;
export const selectCurrentIngredientPrice = (state) => state.currentIngredient.ingredient?.price;
export const selectCurrentIngredientImage = (state) => state.currentIngredient.ingredient?.image;

export default currentIngredientSlice.reducer;
