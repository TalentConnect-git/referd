"use client";

import { useCallback, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { messageService } from "@/services/message.service";
import { Conversation } from "@/types/chat";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";

type CreateConversationOptions = {
  receiverName?: string;
  redirect?: boolean;
};

const getRolePath = (role?: string | null, pathname?: string | null) => {
  const roleFromPath = pathname?.split("/")?.filter(Boolean)?.[0];

  if (roleFromPath === "professional") return "professional";
  if (roleFromPath === "student") return "student";
  if (roleFromPath === "fresher") return "fresher";

  const normalizedRole = String(role || "").toLowerCase();

  if (normalizedRole.includes("professional")) return "professional";
  if (normalizedRole.includes("student")) return "student";
  if (normalizedRole.includes("fresher")) return "fresher";

  return "professional";
};

const normalizeConversation = (
  conversation: Conversation,
  receiverName?: string
): Conversation => {
  return {
    ...conversation,
    name: conversation.name || receiverName || "User",
    lastMessage:
      (conversation as any).lastMessage ||
      (conversation as any).last_message ||
      "",
    updatedAt:
      (conversation as any).updatedAt ||
      (conversation as any).updated_at ||
      new Date().toISOString(),
  };
};

export const useCreateConversation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setSelectedConversation } = useChat();
  const { role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const createConversation = useCallback(
    async (
      receiverId: string,
      options: CreateConversationOptions = {}
    ): Promise<Conversation> => {
      const { receiverName, redirect = true } = options;

      if (!receiverId || typeof receiverId !== "string") {
        throw new Error("Receiver user id is required");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await messageService.createConversation(receiverId);

        const rawConversation =
          (response as any)?.conversation ||
          (response as any)?.data ||
          response;

        if (!rawConversation?._id) {
          throw new Error("Conversation id not found from server response");
        }

        const conversation = normalizeConversation(
          rawConversation,
          receiverName
        );

        setSelectedConversation(conversation);

        if (redirect) {
          const rolePath = getRolePath(role, pathname);
          router.push(`/${rolePath}/message/${conversation._id}`, {
            scroll: false,
          });
        }

        return conversation;
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create conversation";

        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [pathname, role, router, setSelectedConversation]
  );

  return {
    createConversation,
    loading,
    error,
  };
};