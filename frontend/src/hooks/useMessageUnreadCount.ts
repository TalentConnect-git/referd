"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { messageService } from "@/services/message.service";
import { useSocketContext } from "@/context/SocketContext";

const calculateTotalUnread = (map: Record<string, number>) => {
  return Object.values(map).reduce((sum, value) => {
    return sum + Number(value || 0);
  }, 0);
};

const runAfterReactUpdate = (callback: () => void) => {
  if (typeof window === "undefined") return;

  window.setTimeout(callback, 0);
};

export const useMessageUnreadCount = () => {
  const [messageUnreadCount, setMessageUnreadCount] = useState(0);
  const { socket } = useSocketContext();

  const mountedRef = useRef(false);
  const fetchingRef = useRef(false);

  const safeSetMessageUnreadCount = useCallback((count: number) => {
    runAfterReactUpdate(() => {
      if (!mountedRef.current) return;
      setMessageUnreadCount(count);
    });
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;

    try {
      const unreadMap = await messageService.getUnreadCounts();
      const total = calculateTotalUnread(unreadMap || {});
      safeSetMessageUnreadCount(total);
    } catch (error) {
      console.error("Failed to fetch message unread count:", error);
      safeSetMessageUnreadCount(0);
    } finally {
      fetchingRef.current = false;
    }
  }, [safeSetMessageUnreadCount]);

  useEffect(() => {
    mountedRef.current = true;
    fetchUnreadCount();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchUnreadCount]);

  useEffect(() => {
    const handleUnreadTotalUpdated = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      const totalUnread = Number(detail.totalUnread || 0);

      safeSetMessageUnreadCount(totalUnread);
    };

    const handleChatStateChanged = () => {
      runAfterReactUpdate(() => {
        fetchUnreadCount();
      });
    };

    window.addEventListener(
      "chat:unread-total-updated",
      handleUnreadTotalUpdated
    );
    window.addEventListener("chat:clear-unread", handleChatStateChanged);
    window.addEventListener("chat:message-sent", handleChatStateChanged);
    window.addEventListener("chat:message-received", handleChatStateChanged);

    return () => {
      window.removeEventListener(
        "chat:unread-total-updated",
        handleUnreadTotalUpdated
      );
      window.removeEventListener("chat:clear-unread", handleChatStateChanged);
      window.removeEventListener("chat:message-sent", handleChatStateChanged);
      window.removeEventListener("chat:message-received", handleChatStateChanged);
    };
  }, [fetchUnreadCount, safeSetMessageUnreadCount]);

  useEffect(() => {
    if (!socket) return;

    const handleSocketUpdate = () => {
      runAfterReactUpdate(() => {
        fetchUnreadCount();
      });
    };

    socket.on("newMessage", handleSocketUpdate);
    socket.on("messageRead", handleSocketUpdate);
    socket.on("conversationUpdated", handleSocketUpdate);

    return () => {
      socket.off("newMessage", handleSocketUpdate);
      socket.off("messageRead", handleSocketUpdate);
      socket.off("conversationUpdated", handleSocketUpdate);
    };
  }, [socket, fetchUnreadCount]);

  return {
    messageUnreadCount,
    refreshMessageUnreadCount: fetchUnreadCount,
  };
};