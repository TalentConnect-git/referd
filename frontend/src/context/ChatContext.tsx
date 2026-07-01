// context/ChatContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Conversation, Message } from "@/types/chat";

interface ChatContextType {
  // Existing
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  showFloatingChat: boolean;
  setShowFloatingChat: (show: boolean) => void;

  // New: conversation list and unread counts (shared across components)
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  unreadCounts: Record<string, number>;
  setUnreadCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  totalUnread: number;
  setTotalUnread: (total: number) => void;
  clearUnreadCount: (conversationId: string) => void;
  refreshConversations: () => Promise<void>; // will be set by hook
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  // Existing state
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showFloatingChat, setShowFloatingChat] = useState(false);

  // New shared state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [totalUnread, setTotalUnread] = useState(0);

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

  // Placeholder for refresh; will be overridden by useGetAllUsers
  const refreshConversations = async () => {};

  const value = {
    selectedConversation,
    setSelectedConversation,
    messages,
    setMessages,
    showFloatingChat,
    setShowFloatingChat,
    conversations,
    setConversations,
    unreadCounts,
    setUnreadCounts,
    totalUnread,
    setTotalUnread,
    clearUnreadCount,
    refreshConversations,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};