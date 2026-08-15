"use client";

import React, { memo, useMemo } from "react";
import { CheckCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
  formatMessageTime: (date: string) => string;
}

const getSenderId = (message: any): string => {
  return (
    message?.senderId ||
    message?.sender?._id ||
    (typeof message?.sender === "string"
      ? message.sender
      : "") ||
    ""
  );
};

const getMessageText = (message: any): string => {
  return (
    message?.message ||
    message?.text ||
    message?.content ||
    ""
  );
};

const MessageBubble = ({
  message,
  formatMessageTime,
}: MessageBubbleProps) => {
  const { user } = useAuth();

  const senderId = useMemo(
    () => getSenderId(message),
    [message]
  );

  const isMyMessage = useMemo(() => {
    if (!user?._id || !senderId) {
      return false;
    }

    return (
      String(senderId) === String(user._id)
    );
  }, [senderId, user?._id]);

  const messageText = useMemo(
    () => getMessageText(message),
    [message]
  );

  /**
   * Backend field:
   *
   * read: false -> grey double tick
   * read: true  -> blue double tick
   */
  const isRead =
    isMyMessage && message.read === true;

  return (
    <div
      className={`mb-1 flex w-full ${
        isMyMessage
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[75%] flex-col ${
          isMyMessage
            ? "items-end"
            : "items-start"
        }`}
      >
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isMyMessage
              ? "rounded-tr-sm"
              : "rounded-tl-sm"
          }`}
          style={{
            background: isMyMessage
              ? "var(--primary)"
              : "var(--card)",

            color: isMyMessage
              ? "var(--text-inverse)"
              : "var(--text-secondary)",

            border: isMyMessage
              ? "none"
              : "1px solid var(--border)",

            boxShadow: isMyMessage
              ? "0 2px 8px rgba(34, 197, 94, 0.2)"
              : "none",
          }}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {messageText}
          </p>
        </div>

        {/* Time + Read receipt */}
        <div
          className={`mt-1 flex items-center gap-1 ${
            isMyMessage
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <span
            className="text-[10px]"
            style={{
              color: "var(--text-muted)",
            }}
          >
            {formatMessageTime(
              message.createdAt
            )}
          </span>

          {isMyMessage && (
            <CheckCheck
              className="h-3.5 w-3.5"
              strokeWidth={2.4}
              style={{
                color: isRead
                  ? "#3b82f6"
                  : "var(--text-muted)",
              }}
              aria-label={
                isRead
                  ? "Read"
                  : "Delivered"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(MessageBubble);

MessageBubble.displayName =
  "MessageBubble";