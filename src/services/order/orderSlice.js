import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";



export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (ingredients, { rejectWithValue }) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return rejectWithValue('Отсутствует токен авторизации');
        }

        try {
            const response = await api.createOrder({ ingredients, token });
            return response;
        } catch (apiError) {

            if (apiError.message.includes('jwt')) {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const refreshData = await api.refreshToken(refreshToken);
                    if (refreshData.success) {
                        localStorage.setItem('accessToken', refreshData.accessToken);

                        const response = await api.createOrder({
                            ingredients,
                            token: refreshData.accessToken
                        });
                        return response;
                    }
                }
            }
            return rejectWithValue(apiError.message);
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orderNumber: null,
        status: "idle",
        error: null,
    },
    reducers: {
        clearOrder: (state) => {
            state.orderNumber = null;
            state.status = "idle";
            state.error = null;
        },
    },
    //обрабатываем состояния асинхронного действия CHECKED
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.orderNumber = action.payload.order.number;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Произошла ошибка при создании заказа";
            });
    },
});

export const { clearOrder } = orderSlice.actions;

export const selectOrderNumber = (state) => state.order.orderNumber;
export const selectOrderStatus = (state) => state.order.status;
export const selectOrderError = (state) => state.order.error;

export default orderSlice.reducer;
