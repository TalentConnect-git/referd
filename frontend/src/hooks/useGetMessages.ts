// hooks/useGetMessages.ts
import { useEffect, useState, useCallback } from "react";
import { useChat } from "@/context/ChatContext";
import { messageService } from "@/services/message.service";
import { Message } from "@/types/chat";

export const useGetMessages = () => {
  const { selectedConversation, setMessages } = useChat();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!selectedConversation?._id) {
      setMessages([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await messageService.getMessages(selectedConversation._id);
      setMessages(data as Message[]);
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      setError(err?.message || "Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [selectedConversation, setMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { loading, error, refreshMessages: fetchMessages };
};