import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { socketMiddleware } from './feed/socketMiddleware';
import { profileOrdersSocketMiddleware } from './feed/profileOrdersSocketMiddleware';


export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'feed/wsConnecting',
          'feed/wsConnect',
          'feed/wsDisconnect',
          'feed/wsError',
          'feed/wsMessage',
          'feed/wsInit',
          'feed/wsConnecting',
          'feed/wsConnect',
          'feed/wsDisconnect',
          'feed/wsError',
          'feed/wsMessage'
        ]
      }
    }).concat(socketMiddleware, profileOrdersSocketMiddleware),
});

export type AppDispatch = typeof store.dispatch;
