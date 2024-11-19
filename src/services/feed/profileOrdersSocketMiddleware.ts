import { Middleware } from 'redux';
import {
  wsConnecting,
  wsConnect,
  wsDisconnect,
  wsError,
  wsMessage,
  wsSendMessage,
  WsConnectionPayload
} from './profileOrdersSlice';


const MAX_RECONNECT_ATTEMPTS = 5;
const CONNECTION_TIMEOUT = 10000;

export const profileOrdersSocketMiddleware: Middleware = (store) => {
  let socket: WebSocket | null = null;
  let reconnectAttempts = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  const clearTimers = () => {
    if (reconnectTimer) clearTimeout(reconnectTimer);
  };

  const connect = (url: string, token: string) => {
    if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN))
    {

   return;
 }

  if (socket) {
    socket.close();
  }

  setTimeout(() => {
    const fullUrl = `${url}?token=${token}`;
    socket = new WebSocket(fullUrl);
    const connectionTimer = setTimeout(() => {
      if (socket && socket.readyState !== WebSocket.OPEN) {
        socket.close();
        store.dispatch(wsError('Превышено время ожидания подключения'));
      }
    }, CONNECTION_TIMEOUT);

    socket.onopen = () => {
      clearTimeout(connectionTimer);
      store.dispatch(wsConnect());
      reconnectAttempts = 0;
    };

    socket.onerror = (error) => {
      store.dispatch(wsError(`Ошибка подключения к WebSocket: ${(error as any).message || 'Неизвестная ошибка'}`));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        store.dispatch(wsMessage(data));
      } catch (parseError) {
      }
    };

    socket.onclose = (event) => {
      store.dispatch(wsDisconnect());

      if (!event.wasClean) {
        store.dispatch(wsError('Соединение было неожиданно закрыто'));

        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(30000, Math.pow(2, reconnectAttempts) * 1000);
          reconnectTimer = setTimeout(() => {
            reconnectAttempts++;
            connect(url, token);
          }, delay);
        } else {
          store.dispatch(wsError('Не удалось установить стабильное соединение'));
        }
      }
    };
  }, 1000);
};

  return (next) => (action) => {
    if (wsConnecting.match(action)) {
      const payload = action.payload as WsConnectionPayload;
      if (payload && payload.url && payload.token) {
        connect(payload.url, payload.token);
      } else {
        store.dispatch(wsError('Некорректные параметры подключения'));
      }
    }

    if (wsDisconnect.match(action)) {
      clearTimers();
      if (socket) {
        socket.close();
      }
    }

    if (wsSendMessage.match(action)) {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(action.payload));
      } else {
        console.error('WebSocket не подключен. Невозможно отправить сообщение.');
      }
    }

    return next(action);
  };
};
