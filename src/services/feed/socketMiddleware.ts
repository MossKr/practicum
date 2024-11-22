import {
  Middleware,
  MiddlewareAPI,
  AnyAction
} from 'redux';

export interface WsActionTypes {
  wsConnecting: string;
  wsConnect: string;
  wsDisconnect: string;
  wsError: string;
  wsMessage: string;
}

export interface WsConnectionPayload {
  url: string;
  token?: string;
}

interface WsActionConfig {
  type: string;
  action: (payload: any) => AnyAction;
}

export const socketMiddleware = (
  wsActions: {
    wsConnecting: WsActionConfig;
    wsConnect: WsActionConfig;
    wsDisconnect: WsActionConfig;
    wsError: WsActionConfig;
    wsMessage: WsActionConfig;
  }
): Middleware => {
  return (store: MiddlewareAPI) => {
    let socket: WebSocket | null = null;
    let reconnectAttempts = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const MAX_RECONNECT_ATTEMPTS = 5;
    const CONNECTION_TIMEOUT = 10000;
    const RECONNECT_TIMEOUT = 1000;

    const { dispatch } = store;

    const clearTimers = () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const closeSocket = () => {
      if (socket) {
        socket.close();
        socket = null;
      }
    };

    const connect = (payload: WsConnectionPayload) => {
      const { url, token } = payload;

      if (socket &&
          (socket.readyState === WebSocket.CONNECTING ||
           socket.readyState === WebSocket.OPEN)) {
        return;
      }

      closeSocket();

      setTimeout(() => {
        const fullUrl = token ? `${url}?token=${token}` : url;

        try {
          socket = new WebSocket(fullUrl);
        } catch (error) {
          dispatch(wsActions.wsError.action(`Ошибка создания WebSocket: ${error}`));
          return;
        }

        const connectionTimer = setTimeout(() => {
          if (socket && socket.readyState !== WebSocket.OPEN) {
            closeSocket();
            dispatch(wsActions.wsError.action('Превышено время ожидания подключения'));
          }
        }, CONNECTION_TIMEOUT);

        socket.onopen = () => {
          clearTimeout(connectionTimer);
          dispatch(wsActions.wsConnect.action(null));
          reconnectAttempts = 0;
        };

        socket.onerror = (error) => {
          dispatch(wsActions.wsError.action(
            `Ошибка подключения к WebSocket: ${(error as any).message || 'Неизвестная ошибка'}`
          ));
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            dispatch(wsActions.wsMessage.action(data));
          } catch (parseError) {
            console.error('Ошибка при разборе сообщения WebSocket:', parseError);
          }
        };

        socket.onclose = (event) => {
          dispatch(wsActions.wsDisconnect.action(null));

          if (!event.wasClean) {
            dispatch(wsActions.wsError.action('Соединение было неожиданно закрыто'));

            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
              const delay = Math.min(30000, Math.pow(2, reconnectAttempts) * RECONNECT_TIMEOUT);
              reconnectTimer = setTimeout(() => {
                reconnectAttempts++;
                connect(payload);
              }, delay);
            } else {
              dispatch(wsActions.wsError.action('Не удалось установить стабильное соединение'));
            }
          }
        };
      }, RECONNECT_TIMEOUT);
    };

    return (next) => (action: unknown) => {
      if (typeof action === 'object' && action !== null && 'type' in action) {
        const typedAction = action as AnyAction;

        if (typedAction.type === wsActions.wsConnecting.type) {
          connect(typedAction.payload);
        }

        if (typedAction.type === wsActions.wsDisconnect.type) {
          clearTimers();
          closeSocket();
        }
      }

      return next(action);
    };
  };
};
