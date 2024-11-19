import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface ProfileOrder {
  ingredients: string[];
  _id: string;
  status: 'created' | 'pending' | 'done';
  number: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileOrdersState {
  orders: ProfileOrder[];
  total: number;
  totalToday: number;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
  error: string | null;
}


export interface WsConnectionPayload {
  url: string;
  token: string;
}

const initialState: ProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  connectionStatus: 'idle',
  error: null
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    wsConnecting: (state, action: PayloadAction<WsConnectionPayload>) => {
      state.connectionStatus = 'connecting';
    },

    wsConnect: (state) => {
      state.connectionStatus = 'connected';
    },
    wsDisconnect: (state) => {
      state.connectionStatus = 'disconnected';
      state.orders = [];
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.connectionStatus = 'error';
      state.error = action.payload;
    },
    wsSendMessage: (state, action: PayloadAction<any>) => {

    },
    wsMessage: (state, action: PayloadAction<{
      success: boolean;
      orders: ProfileOrder[];
      total: number;
      totalToday: number;
    }>) => {
      const { orders, total, totalToday } = action.payload;

      state.orders = orders.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      state.total = total;
      state.totalToday = totalToday;
    },
    wsReconnect: (state) => {
      state.connectionStatus = 'connecting';
      state.error = null;
    }
  }
});

export const {
  wsConnecting,
  wsConnect,
  wsDisconnect,
  wsError,
  wsMessage,
  wsReconnect,
  wsSendMessage
} = profileOrdersSlice.actions;

export const selectProfileOrders = (state: RootState) => state.profileOrders.orders;
export const selectProfileOrdersTotal = (state: RootState) => state.profileOrders.total;
export const selectProfileOrdersTotalToday = (state: RootState) => state.profileOrders.totalToday;
export const selectProfileOrdersConnectionStatus = (state: RootState) => state.profileOrders.connectionStatus;
export const selectProfileOrdersError = (state: RootState) => state.profileOrders.error;

export default profileOrdersSlice.reducer;
