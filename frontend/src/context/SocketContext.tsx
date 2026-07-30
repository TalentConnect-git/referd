"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
  useMemo,
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

  const socketRef = useRef<Socket | null>(null);

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!user?._id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      setOnlineUsers([]);

      return;
    }

    console.log("==================================");
    console.log("Connecting Socket");
    console.log("User:", user._id);
    console.log("==================================");

    // Prevent duplicate sockets
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
      {
        query: {
          userId: user._id,
        },

        transports: ["websocket"],

        upgrade: false,

        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.log("Socket Error:", err.message);
    });

    socket.on("reconnect", () => {
      console.log("Socket Reconnected");
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log("Reconnect Attempt:", attempt);
    });

    socket.on("getOnlineUsers", (users: string[]) => {
      console.log("Online Users:", users);
      setOnlineUsers(users);
    });

    return () => {
      console.log("Cleaning socket...");

      socket.removeAllListeners();

      socket.disconnect();

      socketRef.current = null;

      setOnlineUsers([]);
    };
  }, [user?._id]);

  const value = useMemo(
    () => ({
      socket: socketRef.current,
      onlineUsers,
    }),
    [onlineUsers]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};