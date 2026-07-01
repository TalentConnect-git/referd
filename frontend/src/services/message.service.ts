"use client";

import axiosInstance from "@/lib/axiosInstance";
import { Conversation, Message } from "@/types/chat";

const READ_MESSAGES_KEY = "chat_read_messages";

const isBrowser = () => typeof window !== "undefined";

const readSetFromStorage = (key: string): Set<string> => {
  if (!isBrowser()) return new Set();

  try {
    const stored = localStorage.getItem(key);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
};

const saveSetToStorage = (key: string, value: Set<string>) => {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(key, JSON.stringify([...value]));
  } catch (error) {
    console.error("LocalStorage save failed:", error);
  }
};

const getPartnerId = (value: any): string => {
  return String(
    value?.chatPartnerId ||
      value?.userId ||
      value?.receiverId ||
      value?.senderId ||
      value?.user?._id ||
      value?.receiver?._id ||
      value?.sender?._id ||
      value?.profile?._id ||
      value?._id ||
      ""
  );
};

const getName = (value: any): string => {
  return (
    value?.name ||
    value?.fullName ||
    value?.userName ||
    value?.receiverName ||
    value?.senderName ||
    value?.chatPartnerName ||
    value?.profile?.name ||
    value?.user?.name ||
    value?.receiver?.name ||
    value?.sender?.name ||
    "User"
  );
};

const getMessageText = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;

  return value.message || value.text || value.content || "";
};

const getLastMessageText = (value: any): string => {
  const last =
    value?.lastMessage ||
    value?.last_message ||
    value?.latestMessage ||
    value?.recentMessage;

  return getMessageText(last) || getMessageText(value);
};

const getUpdatedAt = (value: any): string => {
  const last =
    value?.lastMessage ||
    value?.last_message ||
    value?.latestMessage ||
    value?.recentMessage;

  return (
    value?.updatedAt ||
    value?.updated_at ||
    last?.createdAt ||
    last?.updatedAt ||
    value?.createdAt ||
    new Date().toISOString()
  );
};

export const normalizeConversation = (
  value: any
): Conversation | null => {
  const id = getPartnerId(value);

  if (!id) return null;

  return {
    ...value,
    _id: id,
    name: getName(value),
    lastMessage: getLastMessageText(value),
    updatedAt: getUpdatedAt(value),
  };
};

export const normalizeMessage = (
  value: any,
  fallback?: {
    senderId?: string;
    receiverId?: string;
    text?: string;
  }
): Message => {
  const senderId =
    value?.senderId ||
    value?.sender?._id ||
    (typeof value?.sender === "string" ? value.sender : "") ||
    fallback?.senderId ||
    "";

  const receiverId =
    value?.receiverId ||
    value?.receiver?._id ||
    (typeof value?.receiver === "string" ? value.receiver : "") ||
    fallback?.receiverId ||
    "";

  return {
    ...value,
    _id:
      String(value?._id || value?.id || "") ||
      `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    senderId,
    receiverId,
    sender: value?.sender || senderId,
    receiver: value?.receiver || receiverId,
    message: getMessageText(value) || fallback?.text || "",
    createdAt: value?.createdAt || new Date().toISOString(),
    updatedAt: value?.updatedAt || value?.createdAt || new Date().toISOString(),
    read: Boolean(value?.read),
  };
};

const unwrapList = (data: any): any[] => {
  const list =
    data?.data ||
    data?.messages ||
    data?.conversations ||
    data?.users ||
    data?.allUsers ||
    data;

  return Array.isArray(list) ? list : [];
};

const unwrapMessage = (data: any): any => {
  return (
    data?.data ||
    data?.newMessage ||
    data?.sentMessage ||
    data?.savedMessage ||
    data?.messageData ||
    data?.messageObject ||
    data?.chat ||
    data
  );
};

const normalizeUnreadId = (item: any): string => {
  return String(
    item?.chatPartnerId ||
      item?.userId ||
      item?.senderId ||
      item?.receiverId ||
      item?._id?._id ||
      item?._id ||
      ""
  );
};

const normalizeUnreadCountValue = (value: any): number => {
  if (typeof value === "object" && value !== null) {
    return Number(value.count || value.unreadCount || 0);
  }

  return Number(value || 0);
};



export const messageService = {
  async getAllConversations(): Promise<Conversation[]> {
    try {
      const { data } = await axiosInstance.get("/api/messages/allusers");

      return unwrapList(data)
        .map(normalizeConversation)
        .filter(Boolean) as Conversation[];
    } catch (error) {
      console.error("getAllConversations error:", error);
      return [];
    }
  },

  async createConversation(receiverId: string): Promise<Conversation> {
  try {
    const { data } = await axiosInstance.post(
      "/api/messages/create-conversation",
      {
        receiverId,
      }
    );

    const conversation =
      data?.conversation ||
      data?.data ||
      data;

    const normalized = normalizeConversation(conversation);

    if (!normalized) {
      throw new Error("Invalid conversation returned from server.");
    }

    return normalized;
  } catch (error) {
    console.error("createConversation error:", error);
    throw error;
  }
},

  async getMessages(chatPartnerId: string): Promise<Message[]> {
    try {
      const { data } = await axiosInstance.get(
        `/api/messages/get/${chatPartnerId}`
      );

      const messages = unwrapList(data).map((msg) => normalizeMessage(msg));

      const readIds = readSetFromStorage(READ_MESSAGES_KEY);

      messages.forEach((msg) => {
        if (msg._id) readIds.add(msg._id);
      });

      saveSetToStorage(READ_MESSAGES_KEY, readIds);

      return messages;
    } catch (error) {
      console.error("getMessages error:", error);
      return [];
    }
  },

  async sendMessage(receiverId: string, message: string): Promise<any> {
    const { data } = await axiosInstance.post(`/api/messages/send/${receiverId}`, {
      message,
    });

    return unwrapMessage(data);
  },

  async getUnreadCounts(): Promise<Record<string, number>> {
    try {
      const { data } = await axiosInstance.get("/api/messages/unread-count");

      const raw = data?.data || data?.unreadCounts || data;
      const map: Record<string, number> = {};

      if (Array.isArray(raw)) {
        raw.forEach((item: any) => {
          const id = normalizeUnreadId(item);
          const count = Number(item?.count || item?.unreadCount || 0);

          if (id && count > 0) {
            map[id] = count;
          }
        });

        return map;
      }

      if (raw && typeof raw === "object") {
        Object.entries(raw).forEach(([id, value]) => {
          const count = normalizeUnreadCountValue(value);

          if (id && count > 0) {
            map[id] = count;
          }
        });

        return map;
      }

      return {};
    } catch (error) {
      console.error("getUnreadCounts error:", error);
      return {};
    }
  },

  markMessageAsReadLocally(messageId: string): void {
    if (!messageId) return;

    const readIds = readSetFromStorage(READ_MESSAGES_KEY);
    readIds.add(messageId);
    saveSetToStorage(READ_MESSAGES_KEY, readIds);
  },

  isMessageRead(messageId: string): boolean {
    if (!messageId) return false;
    return readSetFromStorage(READ_MESSAGES_KEY).has(messageId);
  },
};