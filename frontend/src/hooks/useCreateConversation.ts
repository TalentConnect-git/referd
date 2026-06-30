// hooks/useCreateConversation.ts
import { useState } from "react";
import { messageService } from "@/services/message.service";
import { Conversation } from "@/types/chat";
import { useChat } from "@/context/ChatContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const useCreateConversation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setSelectedConversation } = useChat();
  const router = useRouter();
  const { role } = useAuth();

  const createConversation = async (receiverId: string, receiverName?: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Creating conversation with:", receiverId);
      const conversation = await messageService.createConversation(receiverId);
      console.log("Conversation created:", conversation);

      setSelectedConversation(conversation);
      router.push(`/${role}/message/${conversation._id}`);
      return conversation;
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      setError(error.response?.data?.message || "Failed to create conversation");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createConversation, loading, error };
};