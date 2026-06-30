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
  const { notifications, markAsRead, clearUnreadCount } = useNotification();

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

      // Since we can't directly set notifications, we need to:
      // 1. Clear existing notifications by marking all as read? Or we need to handle this differently
      // 2. Or we can use addNotification for each notification
      
      // Option 1: If you want to replace all notifications, you'll need to add a setNotifications method
      // to your context. I'll show you how to do that below.
      
      // For now, let's log the data and you can decide the approach
      console.log("Fetched notifications:", data);
      
      // You might want to clear unread count and then mark notifications as needed
      // clearUnreadCount(); // This clears unread count but doesn't reset notifications
      
    } catch (error) {
      console.log("Error in useGetNotifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  return { loading, refreshNotifications };
};

export default useGetNotifications;