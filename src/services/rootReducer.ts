//rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import ingredientsReducer from "./ingredients/ingredientsSlice";
import constructorReducer from "./constructor/constructorSlice";
import currentIngredientReducer from "./currentIngredient/currentIngredientSlice";
import orderReducer from "./order/orderSlice";
import authReducer from './auth/authSlice';
import feedReducer from './feed/feedSlice';
import profileOrdersReducer from './feed/profileOrdersSlice';

const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    lego: constructorReducer,
    currentIngredient: currentIngredientReducer,
    order: orderReducer,
    auth: authReducer,
    feed: feedReducer,
    profileOrders: profileOrdersReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
