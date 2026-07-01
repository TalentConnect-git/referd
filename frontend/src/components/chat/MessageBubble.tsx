"use client";

import { memo, useMemo } from "react";
import { CheckCheck } from "lucide-react";
import { Message } from "@/types/chat";
import { useAuth } from "@/context/AuthContext";
import { messageService } from "@/services/message.service";

interface MessageBubbleProps {
  message: Message;
  formatMessageTime: (date: string) => string;
}

const getSenderId = (message: any) => {
  return (
    message?.senderId ||
    message?.sender?._id ||
    (typeof message?.sender === "string" ? message.sender : "") ||
    ""
  );
};

const getMessageText = (message: any) => {
  return message?.message || message?.text || message?.content || "";
};

export const MessageBubble = memo(
  ({ message, formatMessageTime }: MessageBubbleProps) => {
    const { user } = useAuth();

    const isMyMessage = useMemo(() => {
      const senderId = getSenderId(message);
      return Boolean(senderId && user?._id && senderId === user._id);
    }, [message, user?._id]);

    const isRead =
      Boolean(message.read) || messageService.isMessageRead(message._id);

    return (
      <div
        className={`mb-1 flex ${
          isMyMessage ? "justify-end" : "justify-start"
        } animate-slide-in-up`}
      >
        <div
          className={`flex max-w-[75%] flex-col ${
            isMyMessage ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`rounded-2xl px-4 py-2.5 ${
              isMyMessage ? "rounded-tr-sm" : "rounded-tl-sm"
            }`}
            style={{
              background: isMyMessage ? "var(--primary)" : "var(--card)",
              color: isMyMessage ? "#fff" : "var(--text-secondary)",
              border: isMyMessage ? "none" : "1px solid var(--border)",
              boxShadow: isMyMessage
                ? "0 2px 8px rgba(34,197,94,0.2)"
                : "none",
            }}
          >
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {getMessageText(message)}
            </p>
          </div>

          <div
            className={`mt-1 flex items-center gap-1 ${
              isMyMessage ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className="text-[10px]"
              style={{ color: "var(--text-muted)" }}
            >
              {formatMessageTime(message.createdAt)}
            </span>

            {isMyMessage && (
              <CheckCheck
                className="h-3 w-3"
                style={{
                  color: isRead ? "#34b7f1" : "var(--text-muted)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";