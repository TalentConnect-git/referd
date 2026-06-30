// hooks/useSendMessage.ts
import { useCallback, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { useChat } from "@/context/ChatContext";
import { useSocketContext } from "@/context/SocketContext";
import { Message } from "@/types/chat";

interface UseSendMessageReturn {
  sendMessages: (message: string) => Promise<Message | null>;
}

const useSendMessage = (): UseSendMessageReturn => {
  const { setMessages, selectedConversation } = useChat();
  const { socket } = useSocketContext();
  const isSendingRef = useRef(false);

  const sendMessages = useCallback(async (message: string): Promise<Message | null> => {
    if (!selectedConversation?._id) {
      toast.error("No conversation selected");
      return null;
    }

    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return null;
    }

    if (isSendingRef.current) return null;
    isSendingRef.current = true;

    try {
      const res = await axiosInstance.post(
        `/api/messages/send/${selectedConversation._id}`,
        { message }
      );

      if (res.data && res.data._id) {
        const newMessage: Message = { ...res.data };

        setMessages((prev) => {
          const exists = prev.some((m) => m._id === newMessage._id);
          return exists ? prev : [...prev, newMessage];
        });

        if (socket) {
          socket.emit("newMessage", newMessage);
        }

        return newMessage;
      }
      return null;
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.error || "Failed to send message");
      return null;
    } finally {
      isSendingRef.current = false;
    }
  }, [selectedConversation, setMessages, socket]);

  return { sendMessages };
};

export default useSendMessage;