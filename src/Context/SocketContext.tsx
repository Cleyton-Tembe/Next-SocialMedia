"use client";

import { GetDbUserId } from "@/actions/user-action";
import {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";

type MessageHandler = (data: any) => void;

type SocketContextType = {
  socketRef: React.RefObject<WebSocket | null>;
  onMessage: (handler: MessageHandler) => () => void;
  connected: boolean;
};

export const SocketProv = createContext<SocketContextType | null>(null);

const SocketContext = ({ children }: PropsWithChildren) => {
  const socketRef = useRef<WebSocket | null>(null);

  const listenersRef = useRef<Set<MessageHandler>>(new Set());

  const [connected, setConnected] = useState(false);

  const onMessage = (handler: MessageHandler) => {
    listenersRef.current.add(handler);

    return () => {
      listenersRef.current.delete(handler);
    };
  };

  useEffect(() => {

    async function connectSocket() {
      GetDbUserId().then((id)=> {

          
        const socket = new WebSocket(`ws://localhost:4000?userid=${id}`);
        socket.onmessage = (event) => {
          const data = event.data;

          listenersRef.current.forEach((handler) => handler(data));
        };

        socket.onopen = () => {
          console.log("Socket connected");
          setConnected(true);
          socket.send("Hello Server");

          socketRef.current = socket;
        };
      })
      .catch((err)=> {
        console.error("Error Something: ", err)
      });
    }

    connectSocket();

    return () => {
      socketRef.current?.close();
      setConnected(false);
      socketRef.current = null;
    };
  }, []);

  return (
    <SocketProv.Provider
      value={{
        socketRef,
        onMessage,
        connected,
      }}
    >
      {children}
    </SocketProv.Provider>
  );
};

export default SocketContext;
