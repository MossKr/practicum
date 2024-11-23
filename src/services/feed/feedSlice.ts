import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../services/store';

export interface FeedOrder {
  ingredients: string[];
  _id: string;
  status: 'done' | 'pending' | 'created';
  number: number;
  createdAt: string;
  updatedAt: string;
}

export interface FeedState {
  orders: FeedOrder[];
  total: number;
  totalToday: number;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
  error: string | null;
}

interface WsConnectionPayload {
  url: string;
  token?: string;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  connectionStatus: 'idle',
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsInitConnection: (state) => {
      state.connectionStatus = 'idle';
      state.error = null;
    },
    wsConnecting: (state, action: PayloadAction<WsConnectionPayload>) => {
      state.connectionStatus = 'connecting';
      state.error = null;
    },
    wsConnect: (state) => {
      state.connectionStatus = 'connected';
      state.error = null;
    },
    wsDisconnect: (state) => {
      state.connectionStatus = 'disconnected';
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.connectionStatus = 'error';
      state.error = action.payload;
    },
    wsMessage: (state, action: PayloadAction<{
      success: boolean;
      orders: FeedOrder[];
      total: number;
      totalToday: number;
    }>) => {
      const { orders, total, totalToday } = action.payload;
      state.orders = orders;
      state.total = total;
      state.totalToday = totalToday;
      state.connectionStatus = 'connected';
    }

  }
});

export const {
  wsInitConnection,
  wsConnecting,
  wsConnect,
  wsDisconnect,
  wsError,
  wsMessage
} = feedSlice.actions;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedTotal = (state: RootState) => state.feed.total;
export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;
export const selectFeedConnectionStatus = (state: RootState) => state.feed.connectionStatus;
export const selectFeedError = (state: RootState) => state.feed.error;

export default feedSlice.reducer;
