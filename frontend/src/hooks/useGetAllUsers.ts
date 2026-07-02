"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  messageService,
  normalizeConversation,
} from "@/services/message.service";
import { useSocketContext } from "@/context/SocketContext";
import { Conversation } from "@/types/chat";

const calculateTotalUnread = (map: Record<string, number>) => {
  return Object.values(map).reduce((sum, value) => sum + Number(value || 0), 0);
};

const sortConversations = (list: Conversation[]) => {
  return [...list].sort(
    (a, b) =>
      new Date(b.updatedAt || 0).getTime() -
      new Date(a.updatedAt || 0).getTime()
  );
};

const isRealName = (name?: string | null) => {
  if (!name) return false;

  const normalized = name.trim().toLowerCase();

  return normalized !== "" && normalized !== "user" && normalized !== "unknown";
};

const getBetterName = (oldName?: string, newName?: string) => {
  if (isRealName(newName)) return newName as string;
  if (isRealName(oldName)) return oldName as string;
  return newName || oldName || "User";
};

export const useGetAllUsers = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [totalUnread, setTotalUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const isMountedRef = useRef(false);
  const isFetchingRef = useRef(false);

  const { socket } = useSocketContext();

  const setUnreadMap = useCallback((map: Record<string, number>) => {
    setUnreadCounts(map);
    setTotalUnread(calculateTotalUnread(map));

    window.dispatchEvent(
      new CustomEvent("chat:unread-total-updated", {
        detail: {
          totalUnread: calculateTotalUnread(map),
          unreadCounts: map,
        },
      })
    );
  }, []);

  const fetchConversations = useCallback(
    async (showLoading = true) => {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;

      if (showLoading) setLoading(true);

      try {
        const [conversationList, unreadMap] = await Promise.all([
          messageService.getAllConversations(),
          messageService.getUnreadCounts(),
        ]);

        if (!isMountedRef.current) return;

        setConversations((prev) => {
          const mergedMap = new Map<string, Conversation>();

          prev.forEach((item) => {
            if (item?._id) mergedMap.set(item._id, item);
          });

          conversationList.forEach((incoming) => {
            if (!incoming?._id) return;

            const old = mergedMap.get(incoming._id);

            mergedMap.set(incoming._id, {
              ...old,
              ...incoming,
              name: getBetterName(old?.name, incoming.name),
              lastMessage:
                incoming.lastMessage !== undefined
                  ? incoming.lastMessage
                  : old?.lastMessage,
              updatedAt: incoming.updatedAt || old?.updatedAt || new Date().toISOString(),
            });
          });

          return sortConversations([...mergedMap.values()]);
        });

        setUnreadMap(unreadMap || {});
        setHasLoaded(true);
      } catch (error) {
        console.error("fetchConversations error:", error);
      } finally {
        isFetchingRef.current = false;

        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [setUnreadMap]
  );

  const upsertConversation = useCallback((conversation: Partial<Conversation>) => {
    const normalized = normalizeConversation(conversation);

    if (!normalized?._id) return;

    setConversations((prev) => {
      const oldItem = prev.find((item) => item._id === normalized._id);
      const exists = Boolean(oldItem);

      const finalConversation: Conversation = {
        ...oldItem,
        ...normalized,
        name: getBetterName(oldItem?.name, normalized.name),
        lastMessage:
          normalized.lastMessage !== undefined
            ? normalized.lastMessage
            : oldItem?.lastMessage,
        updatedAt:
          normalized.updatedAt ||
          oldItem?.updatedAt ||
          new Date().toISOString(),
      };

      if (exists) {
        const noRealChange =
          oldItem?.name === finalConversation.name &&
          oldItem?.lastMessage === finalConversation.lastMessage &&
          oldItem?.updatedAt === finalConversation.updatedAt;

        if (noRealChange) return prev;
      }

      const next = exists
        ? prev.map((item) =>
            item._id === finalConversation._id ? finalConversation : item
          )
        : [finalConversation, ...prev];

      return sortConversations(next);
    });
  }, []);

  const clearUnreadCount = useCallback((chatPartnerId: string) => {
    if (!chatPartnerId) return;

    setUnreadCounts((prev) => {
      if (!prev[chatPartnerId]) return prev;

      const next = { ...prev };
      delete next[chatPartnerId];

      const total = calculateTotalUnread(next);
      setTotalUnread(total);

      window.dispatchEvent(
        new CustomEvent("chat:unread-total-updated", {
          detail: {
            totalUnread: total,
            unreadCounts: next,
          },
        })
      );

      return next;
    });
  }, []);

  const incrementUnreadCount = useCallback((chatPartnerId: string) => {
    if (!chatPartnerId) return;

    setUnreadCounts((prev) => {
      const next = {
        ...prev,
        [chatPartnerId]: Number(prev[chatPartnerId] || 0) + 1,
      };

      const total = calculateTotalUnread(next);
      setTotalUnread(total);

      window.dispatchEvent(
        new CustomEvent("chat:unread-total-updated", {
          detail: {
            totalUnread: total,
            unreadCounts: next,
          },
        })
      );

      return next;
    });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchConversations(true);

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchConversations]);

  useEffect(() => {
    const handleOpenConversation = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      const chatPartnerId = detail.chatPartnerId;
      const chatPartnerName = detail.chatPartnerName;

      if (!chatPartnerId) return;

      upsertConversation({
        _id: chatPartnerId,
        name: chatPartnerName || "User",
        lastMessage: "Start a conversation...",
        updatedAt: new Date().toISOString(),
        isTemporary: true,
      });

      clearUnreadCount(chatPartnerId);
    };

    const handleMessageSent = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      const chatPartnerId = detail.chatPartnerId;
      const chatPartnerName = detail.chatPartnerName;
      const message = detail.message || "";

      if (!chatPartnerId) return;

      upsertConversation({
        _id: chatPartnerId,
        name: chatPartnerName || "User",
        lastMessage: message,
        updatedAt: new Date().toISOString(),
        isTemporary: false,
      });

      clearUnreadCount(chatPartnerId);
    };

    const handleMessageReceived = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      const chatPartnerId = detail.chatPartnerId;
      const chatPartnerName = detail.chatPartnerName;
      const message = detail.message || "";
      const shouldIncrementUnread = Boolean(detail.shouldIncrementUnread);

      if (!chatPartnerId) return;

      upsertConversation({
        _id: chatPartnerId,
        name: chatPartnerName || "User",
        lastMessage: message,
        updatedAt: new Date().toISOString(),
        isTemporary: false,
      });

      if (shouldIncrementUnread) {
        incrementUnreadCount(chatPartnerId);
      } else {
        clearUnreadCount(chatPartnerId);
      }
    };

    const handleClearUnread = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      const chatPartnerId = detail.chatPartnerId;

      if (!chatPartnerId) return;

      clearUnreadCount(chatPartnerId);
    };

    window.addEventListener("chat:open-conversation", handleOpenConversation);
    window.addEventListener("chat:message-sent", handleMessageSent);
    window.addEventListener("chat:message-received", handleMessageReceived);
    window.addEventListener("chat:clear-unread", handleClearUnread);

    return () => {
      window.removeEventListener("chat:open-conversation", handleOpenConversation);
      window.removeEventListener("chat:message-sent", handleMessageSent);
      window.removeEventListener("chat:message-received", handleMessageReceived);
      window.removeEventListener("chat:clear-unread", handleClearUnread);
    };
  }, [upsertConversation, clearUnreadCount, incrementUnreadCount]);

  useEffect(() => {
    if (!socket) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const refreshDebounced = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        fetchConversations(false);
        timeoutId = null;
      }, 500);
    };

    const handleMessageRead = (data: any) => {
      const id = data?.chatPartnerId || data?.conversationId;
      if (id) clearUnreadCount(id);
    };

    socket.on("conversationUpdated", refreshDebounced);
    socket.on("messageRead", handleMessageRead);

    return () => {
      socket.off("conversationUpdated", refreshDebounced);
      socket.off("messageRead", handleMessageRead);

      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [socket, fetchConversations, clearUnreadCount]);

  return {
    conversations,
    unreadCounts,
    totalUnread,
    loading,
    hasLoaded,
    refreshConversations: () => fetchConversations(false),
    clearUnreadCount,
    upsertConversation,
  };
};