import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchIngredients = createAsyncThunk(
    //CHECKED
    "ingredients/fetchIngredients",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.getIngredients();
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const ingredientsSlice = createSlice({
    name: "ingredients",
    initialState: {
        items: [],
        status: "idle", //отсутсвие ошибок, бездействие CHECKED
        error: null,
    },
    reducers: {
        clearIngredientsError: (state) => {
            state.error = null;
        },
    },
    //обрабатываем состояния асинхронного действия CHECKED
    extraReducers: (builder) => {
        builder
            .addCase(fetchIngredients.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchIngredients.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchIngredients.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Произошла ошибка при загрузке ингредиентов";
            });
    },
});

export const { clearIngredientsError } = ingredientsSlice.actions;

export const selectIngredients = (state) => state.ingredients.items;
export const selectIngredientsStatus = (state) => state.ingredients.status;
export const selectIngredientsError = (state) => state.ingredients.error;

export default ingredientsSlice.reducer;
