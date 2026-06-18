"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getNotifications } from "@/services/notification.service";
import { Notification } from "@/types/notification";
import { useSocketContext } from "@/context/SocketContext";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;

  addNotification: (
    notification: Notification
  ) => void;
  markAsRead: (
    notificationId: string
  ) => void;
  clearUnreadCount: () => void;
}

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationContext =createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used inside NotificationProvider"
    );
  }

  return context;
};


export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {



  const { socket } = useSocketContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // get DB notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {

        const data = await getNotifications();
        console.log(data);
        const fetchedNotifications: Notification[] = Array.isArray(data) ? data :[]; //data.notifications || [];
        setNotifications(fetchedNotifications);
        setUnreadCount(fetchedNotifications.filter(
                  (notification) => !notification.read).length);
      } catch (error) {
        console.error(
          "Failed to fetch notifications",
          error
        );
      } 
    };

    fetchNotifications();
  }, []);


  const addNotification = (
    notification: Notification
  ) => {
    setNotifications((prev) => [
      notification,
      ...prev,
    ]);

    setUnreadCount((prev) => prev + 1);
  };

  const markAsRead = (
    notificationId: string
  ) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === notificationId
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const clearUnreadCount = () => {
    setUnreadCount(0);
  };

  // get real time notifications
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (
      notification: Notification
    ) => {
      console.log(
        " Notification received:",
        notification
      );

      addNotification(notification);
    };

    socket.on(
      "newNotification",
      handleNotification
    );

    return () => {
      socket.off(
        "newNotification",
        handleNotification
      );
    };
  }, [socket]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        clearUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};