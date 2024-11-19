import {
  Middleware,
  Dispatch,
  AnyAction
} from 'redux';
import { RootState } from '../store';
import {
  wsConnecting,
  wsConnect,
  wsDisconnect,
  wsError,
  wsMessage
} from './feedSlice';

export const socketMiddleware: Middleware<{}, RootState, Dispatch<AnyAction>> = (store) => (next) => (action) => {
  let socket: WebSocket | null = null;
  const { dispatch } = store;

  if (wsConnecting.match(action)) {
    const { url, token } = action.payload;
    if (socket !== null) {
      (socket as WebSocket).close();
    }


    const wsUrl = token ? `${url}?token=${token}` : url;
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      dispatch(wsConnect());
    };

    socket.onerror = (event) => {
      dispatch(wsError('WebSocket connection error'));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        dispatch(wsMessage(data));
      } catch (error) {
      }
    };

    socket.onclose = (event) => {
      dispatch(wsDisconnect());
    };
  }

  if (wsDisconnect.match(action) && socket !== null) {
    (socket as WebSocket).close();
    socket = null;
  }

  return next(action);
};
