// hooks/useGetAllUsers.ts
import { useEffect, useState, useCallback, useRef } from "react";
import { messageService } from "@/services/message.service";
import { useSocketContext } from "@/context/SocketContext";
import { Conversation } from "@/types/chat";

export const useGetAllUsers = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [totalUnread, setTotalUnread] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);
  const { socket } = useSocketContext();

  const fetchConversations = useCallback(async (showLoading: boolean = true) => {
    // Prevent overlapping requests
    if (isFetchingRef.current || !isMountedRef.current) return;
    isFetchingRef.current = true;
    if (showLoading) setLoading(true);

    try {
      const [conversationsData, unreadData] = await Promise.all([
        messageService.getAllConversations(),
        messageService.getUnreadCounts(),
      ]);

      const mappedConversations = conversationsData.map((conv: any) => ({
        ...conv,
        lastMessage: conv.last_message || conv.lastMessage || "",
        updatedAt: conv.updatedAt || conv.updated_at || new Date().toISOString(),
      }));

      const unreadMap = unreadData || {};
      const total = Object.values(unreadMap).reduce((sum, count) => sum + count, 0);

      if (isMountedRef.current) {
        setConversations(mappedConversations);
        setUnreadCounts(unreadMap);
        setTotalUnread(total);
        setHasLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        isFetchingRef.current = false;
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    isMountedRef.current = true;
    fetchConversations(true);
    return () => { isMountedRef.current = false; };
  }, [fetchConversations]);

  // Socket listeners with debounce for performance
  useEffect(() => {
    if (!socket) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const handleNewMessage = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isMountedRef.current && !isFetchingRef.current) {
          fetchConversations(false);
        }
        timeoutId = null;
      }, 300);
    };

    const handleMessageRead = (data: { conversationId: string }) => {
      if (data.conversationId && isMountedRef.current) {
        // Immediately update unread count for this conversation
        setUnreadCounts((prev) => {
          const newCounts = { ...prev };
          delete newCounts[data.conversationId];
          const newTotal = Object.values(newCounts).reduce((sum, count) => sum + count, 0);
          setTotalUnread(newTotal);
          return newCounts;
        });
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageRead", handleMessageRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageRead", handleMessageRead);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [socket, fetchConversations]);

  const clearUnreadCount = useCallback((conversationId: string) => {
    if (!conversationId) return;
    setUnreadCounts((prev) => {
      const newCounts = { ...prev };
      delete newCounts[conversationId];
      const newTotal = Object.values(newCounts).reduce((sum, count) => sum + count, 0);
      setTotalUnread(newTotal);
      return newCounts;
    });
  }, []);

  const refreshConversations = useCallback(() => {
    if (!isFetchingRef.current && isMountedRef.current) {
      fetchConversations(false);
    }
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    unreadCounts,
    totalUnread,
    refreshConversations,
    clearUnreadCount,
    hasLoaded,
  };
};