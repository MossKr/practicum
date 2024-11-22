import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Ingredient, LoadingState, ApiResponse } from "../../utils/typesTs";

interface IngredientsState {
  items: Ingredient[];
  status: LoadingState;
  error: string | null;
}

export const fetchIngredients = createAsyncThunk<
  Ingredient[],
  void,
  { rejectValue: string }
>("ingredients/fetchIngredients", async (_, { rejectWithValue }) => {
  try {
    const response: ApiResponse<Ingredient[]> = await api.getIngredients();
    if (!response.success || !Array.isArray(response.data)) {
      return rejectWithValue("Некорректный формат ответа от сервера");
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(
      (error as Error).message || "Произошла ошибка при загрузке ингредиентов"
    );
  }
});

const initialState: IngredientsState = {
  items: [],
  status: "idle",
  error: null,
};

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {
    clearIngredientsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action: PayloadAction<Ingredient[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Произошла неизвестная ошибка при загрузке ингредиентов";
      });
  },
});

export const { clearIngredientsError } = ingredientsSlice.actions;

export const selectIngredients = (state: { ingredients: IngredientsState }): Ingredient[] => state.ingredients.items;
export const selectIngredientsStatus = (state: { ingredients: IngredientsState }): LoadingState => state.ingredients.status;
export const selectIngredientsError = (state: { ingredients: IngredientsState }): string | null => state.ingredients.error;

export default ingredientsSlice.reducer;
