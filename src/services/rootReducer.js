import { combineReducers } from "@reduxjs/toolkit";
import ingredientsReducer from "./ingredients/ingredientsSlice";
import constructorReducer from "./constructor/constructorSlice";
import currentIngredientReducer from "./currentIngredient/currentIngredientSlice";
import orderReducer from "./order/orderSlice";

const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    lego: constructorReducer,
    currentIngredient: currentIngredientReducer,
    order: orderReducer,
});

export default rootReducer;
