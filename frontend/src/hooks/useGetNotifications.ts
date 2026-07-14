// hooks/useGetNotifications.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "@/lib/axiosInstance";
import { useNotification } from "@/context/NotificationContext";
import { Notification } from "@/types/notification";

interface UseGetNotificationsReturn {
  loading: boolean;
  refreshNotifications: () => Promise<void>;
}

const useGetNotifications = (): UseGetNotificationsReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setNotifications, clearUnreadCount } = useNotification();

  const refreshNotifications = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await axios.get<{ data: Notification[] } | Notification[]>(
        "/api/notifications",
        {
          withCredentials: true,
        }
      );
      
      // Handle both response formats
      let data: Notification[] = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && typeof res.data === 'object' && 'data' in res.data) {
        data = Array.isArray(res.data.data) ? res.data.data : [];
      } else {
        data = [];
      }

      // Set notifications in context
      setNotifications(data);
      
      // Clear unread count if no unread notifications
      const unreadCount = data.filter((n: Notification) => !n.read).length;
      if (unreadCount === 0) {
        clearUnreadCount();
      }
      
    } catch (error) {
      console.log("Error in useGetNotifications:", error);
    } finally {
      setLoading(false);
    }
  }, [setNotifications, clearUnreadCount]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  return { loading, refreshNotifications };
};

export default useGetNotifications;