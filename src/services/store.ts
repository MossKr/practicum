import {
    configureStore
} from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import {
    socketMiddleware,
    WsActionTypes
} from './feed/socketMiddleware';
import * as profileOrdersActions from './feed/profileOrdersSlice';
import * as feedActions from './feed/feedSlice';

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

const createWsActionTypes = (prefix: string): WsActionTypes => ({
    wsConnecting: `${prefix}/wsConnecting`,
    wsConnect: `${prefix}/wsConnect`,
    wsDisconnect: `${prefix}/wsDisconnect`,
    wsError: `${prefix}/wsError`,
    wsMessage: `${prefix}/wsMessage`
});

const profileOrdersSocketMiddleware = socketMiddleware({
    wsConnecting: {
        type: createWsActionTypes('profileOrders').wsConnecting,
        action: profileOrdersActions.wsConnecting
    },
    wsConnect: {
        type: createWsActionTypes('profileOrders').wsConnect,
        action: profileOrdersActions.wsConnect
    },
    wsDisconnect: {
        type: createWsActionTypes('profileOrders').wsDisconnect,
        action: profileOrdersActions.wsDisconnect
    },
    wsError: {
        type: createWsActionTypes('profileOrders').wsError,
        action: profileOrdersActions.wsError
    },
    wsMessage: {
        type: createWsActionTypes('profileOrders').wsMessage,
        action: profileOrdersActions.wsMessage
    }
});

const feedSocketMiddleware = socketMiddleware({
    wsConnecting: {
        type: createWsActionTypes('feed').wsConnecting,
        action: feedActions.wsConnecting
    },
    wsConnect: {
        type: createWsActionTypes('feed').wsConnect,
        action: feedActions.wsConnect
    },
    wsDisconnect: {
        type: createWsActionTypes('feed').wsDisconnect,
        action: feedActions.wsDisconnect
    },
    wsError: {
        type: createWsActionTypes('feed').wsError,
        action: feedActions.wsError
    },
    wsMessage: {
        type: createWsActionTypes('feed').wsMessage,
        action: feedActions.wsMessage
    }
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    ...Object.values(createWsActionTypes('profileOrders')),
                    ...Object.values(createWsActionTypes('feed')),
                    'feed/wsInitConnection'
                ]
            }
        }).concat(profileOrdersSocketMiddleware, feedSocketMiddleware),
});
