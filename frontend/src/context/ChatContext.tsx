// context/ChatContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Conversation, Message } from "@/types/chat";

interface ChatContextType {
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  showFloatingChat: boolean;
  setShowFloatingChat: (show: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showFloatingChat, setShowFloatingChat] = useState(false);

  // Memoize setters to prevent unnecessary re-renders if passed as props
  const handleSetSelectedConversation = useCallback((conv: Conversation | null) => {
    setSelectedConversation(conv);
  }, []);

  const handleSetMessages = useCallback((msgs: Message[] | ((prev: Message[]) => Message[])) => {
    setMessages(msgs);
  }, []);

  const handleSetShowFloatingChat = useCallback((show: boolean) => {
    setShowFloatingChat(show);
  }, []);

  const value = {
    selectedConversation,
    setSelectedConversation: handleSetSelectedConversation,
    messages,
    setMessages: handleSetMessages,
    showFloatingChat,
    setShowFloatingChat: handleSetShowFloatingChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};