"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext must be used inside SocketProvider"
    );
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({
  children,
}: SocketProviderProps) => {
  const { user } = useAuth();
  const [socket, setSocket] =useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] =useState<string[]>([]);
  useEffect(() => {
    if (!user?._id) {
      return;
    }
    // creates connection
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL!,
      {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      }
    );

    
    socketInstance.on("connect", () => {
      console.log("Socket connected:",socketInstance.id);
    });

    // listens for online users
    socketInstance.on("getOnlineUsers",(users: string[]) => {
        setOnlineUsers(users);
      });

    setSocket(socketInstance);
    return () => {
      socketInstance.close();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{socket,onlineUsers}}>
      {children}
    </SocketContext.Provider>
  );

};




