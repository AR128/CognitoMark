import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useSocket = (handlers = {}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL);
    socketRef.current = socket;

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
      socket.disconnect();
    };
  }, [handlers]);

  return socketRef;
};
