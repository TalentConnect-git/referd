"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

import {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
} from "@/services/notification.service";

import { Notification } from "@/types/notification";
import { useSocketContext } from "@/context/SocketContext";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (
    notifications: Notification[] | ((prev: Notification[]) => Notification[]),
  ) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearUnreadCount: () => void;
}

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }

  return context;
};

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const { socket } = useSocketContext();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initial fetch
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const [notificationData, unreadData] = await Promise.all([
          getNotifications(),
          getUnreadNotifications(),
        ]);

        const fetchedNotifications = Array.isArray(notificationData)
          ? notificationData
          : [];

        setNotifications(fetchedNotifications);

        // Backend unread API
        setUnreadCount(unreadData?.count || 0);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, []);
  // Add notification (socket event)
  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);

    // Increase unread badge
    setUnreadCount((prev) => prev + 1);
  }, []);

  // Mark a single notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Update in backend
      await markNotificationAsRead(notificationId);

      // Update local notifications
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification,
        ),
      );

      // Refresh unread count from backend
      const unreadData = await getUnreadNotifications();
      setUnreadCount(unreadData?.count || 0);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    );

    setUnreadCount(0);
  }, []);

  // Clear unread badge
  const clearUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);
  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;

    const handleNotification = async (notification: Notification) => {
      console.log("Notification received:", notification);

      // Add notification to the top of the list
      addNotification(notification);

      // Refresh unread count from backend
      try {
        const unreadData = await getUnreadNotifications();
        setUnreadCount(unreadData?.count || 0);
      } catch (error) {
        console.error("Failed to fetch unread count", error);
      }
    };

    socket.on("newNotification", handleNotification);

    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, [socket, addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        setNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
