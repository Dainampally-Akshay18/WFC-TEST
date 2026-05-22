import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ENV } from '../config/env';
import { getToken } from '../api/utils/tokenManager';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const socketInstance = io(ENV.SOCKET_URL, {
        auth: { token },
      });

      socketInstance.on('connect', () => {
        setConnected(true);
      });

      socketInstance.on('disconnect', () => {
        setConnected(false);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, []);

  const value = {
    socket,
    connected,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
