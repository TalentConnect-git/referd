"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

import { Conversation, Message } from "@/types/chat";

interface ChatContextType {
  selectedConversation: Conversation | null;
  setSelectedConversation: (
    conversation: Conversation | null
  ) => void;

  messages: Message[];
  setMessages: React.Dispatch<
    React.SetStateAction<Message[]>
  >;

  showFloatingChat: boolean;
  setShowFloatingChat: (show: boolean) => void;

  conversations: Conversation[];
  setConversations: (
    conversations: Conversation[]
  ) => void;

  unreadCounts: Record<string, number>;
  setUnreadCounts: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;

  totalUnread: number;
  setTotalUnread: (count: number) => void;

  clearUnreadCount: (conversationId: string) => void;

  refreshConversations: () => Promise<void>;
}

const ChatContext = createContext<
  ChatContextType | undefined
>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error(
      "useChat must be used inside ChatProvider"
    );
  }

  return context;
};

export const ChatProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [
    selectedConversation,
    setSelectedConversation,
  ] = useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>(
    []
  );

  const [
    showFloatingChat,
    setShowFloatingChat,
  ] = useState(false);

  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);

  const [unreadCounts, setUnreadCounts] =
    useState<Record<string, number>>({});

  const [totalUnread, setTotalUnread] = useState(0);

  const clearUnreadCount = useCallback(
    (conversationId: string) => {
      if (!conversationId) return;

      setUnreadCounts((prev) => {
        const updated = { ...prev };

        delete updated[conversationId];

        const total = Object.values(updated).reduce(
          (sum, count) => sum + count,
          0
        );

        setTotalUnread(total);

        return updated;
      });
    },
    []
  );

  const refreshConversations =
    useCallback(async () => {
      /**
       * This function should be replaced
       * by your conversation hook.
       */
    }, []);

  const value = useMemo(
    () => ({
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
    }),
    [
      selectedConversation,
      messages,
      showFloatingChat,
      conversations,
      unreadCounts,
      totalUnread,
      clearUnreadCount,
      refreshConversations,
    ]
  );

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;