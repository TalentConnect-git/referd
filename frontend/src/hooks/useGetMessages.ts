"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { messageService } from "@/services/message.service";
import { Message } from "@/types/chat";

export const useGetMessages = (chatPartnerId?: string | null) => {
  const { setMessages } = useChat();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  const fetchMessages = useCallback(async () => {
    if (!chatPartnerId) {
      setMessages([]);
      setError(null);
      return;
    }

    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const messages = await messageService.getMessages(chatPartnerId);

      if (requestId !== requestIdRef.current) return;

      setMessages(messages as Message[]);

      window.dispatchEvent(
        new CustomEvent("chat:clear-unread", {
          detail: { chatPartnerId },
        })
      );
    } catch (error: any) {
      if (requestId !== requestIdRef.current) return;

      console.error("fetchMessages error:", error);
      setError(error?.message || "Failed to load messages");
      setMessages([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [chatPartnerId, setMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    loading,
    error,
    refreshMessages: fetchMessages,
  };
};