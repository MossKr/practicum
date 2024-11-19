import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { RootState } from "../store";
import { OrderResponse, LoadingState, AuthResponse } from "../../utils/typesTs";

interface OrderState {
  orderNumber: number | null;
  status: LoadingState;
  error: string | null;
}

export const createOrder = createAsyncThunk<
  OrderResponse,  
  string[],
  {
    rejectValue: string;
  }
>(
  "order/createOrder",
  async (ingredients, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return rejectWithValue('Отсутствует токен авторизации');
    }

    try {
      const response = await api.createOrder({ ingredients, token });
      
     
      if ('success' in response && 'order' in response) {
        return response as OrderResponse;
      }
      
      throw new Error('Некорректный ответ от сервера');
    } catch (apiError: any) {
      if (apiError.message.includes('jwt')) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshData: AuthResponse = await api.refreshToken(refreshToken);
            if (refreshData.success) {
              localStorage.setItem('accessToken', refreshData.accessToken);

              const response = await api.createOrder({
                ingredients,
                token: refreshData.accessToken
              });
              
              if ('success' in response && 'order' in response) {
                return response as OrderResponse;
              }
              
              throw new Error('Некорректный ответ от сервера после обновления токена');
            }
          } catch (refreshError) {
            return rejectWithValue('Ошибка обновления токена');
          }
        }
      }
      return rejectWithValue(apiError.message || 'Неизвестная ошибка');
    }
  }
);

const initialState: OrderState = {
  orderNumber: null,
  status: "idle",
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderNumber = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.status = "succeeded";
        state.orderNumber = action.payload.order.number;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Произошла ошибка при создании заказа";
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export const selectOrderNumber = (state: RootState) => state.order.orderNumber;
export const selectOrderStatus = (state: RootState) => state.order.status;
export const selectOrderError = (state: RootState) => state.order.error;

export default orderSlice.reducer;
