import { createSlice, createSelector } from "@reduxjs/toolkit";

const constructorSlice = createSlice({
    
    name: "lego",
    initialState: {
        bun: null,
        ingredients: [],
    },
    reducers: {
        addIngredient: (state, action) => {
            if (action.payload.type === "bun") {
                state.bun = action.payload; //bun ? меняем на текущую булку
            } else {
                state.ingredients.push({ ...action.payload, uniqueId: Date.now() }); // !bun add в массив с уникальным ID.
            }
        },
        removeIngredient: (state, action) => {
            state.ingredients = state.ingredients.filter((item) => item.uniqueId !== action.payload); 
        },

        moveIngredient: (state, action) => {
            const { dragIndex, hoverIndex } = action.payload;
            const dragItem = state.ingredients[dragIndex];
            const newIngredients = [...state.ingredients];
            newIngredients.splice(dragIndex, 1);
            newIngredients.splice(hoverIndex, 0, dragItem);
            state.ingredients = newIngredients;
        },
        clearConstructor: (state) => {
            //в исходную
            state.bun = null;
            state.ingredients = [];
        },
    },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } = constructorSlice.actions;


export const selectBun = (state) => state.lego.bun;
export const selectIngredients = (state) => state.lego.ingredients;

//консоль ругается, возвращаем только, если действительно изменились bun или ingredients.
export const selectConstructorItems = createSelector([selectBun, selectIngredients], (bun, ingredients) => ({
    bun,
    ingredients,
}));

export const selectTotalPrice = createSelector([selectBun, selectIngredients], (bun, ingredients) => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
    return bunPrice + ingredientsPrice;
});

export default constructorSlice.reducer;
