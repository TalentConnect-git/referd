// components/chat/MessageBubble.tsx
"use client";

import { memo, useEffect, useState } from "react";
import { CheckCheck } from "lucide-react";
import { Message } from "@/types/chat";
import { useAuth } from "@/context/AuthContext";

interface MessageBubbleProps {
  message: Message;
  formatMessageTime: (date: string) => string;
}

export const MessageBubble = memo(({ message, formatMessageTime }: MessageBubbleProps) => {
  const { user } = useAuth();
  // Determine if this message is from the current user
  const isMyMessage = message.senderId === user?._id;
  const [isRead, setIsRead] = useState(message.read);

  useEffect(() => {
    setIsRead(message.read);
  }, [message.read]);

  const formatTime = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-1 animate-slide-in-up`}>
      <div className={`flex flex-col max-w-[75%] ${isMyMessage ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl ${isMyMessage ? "rounded-tr-sm" : "rounded-tl-sm"}`}
          style={{
            background: isMyMessage ? "var(--primary)" : "var(--card)",
            color: isMyMessage ? "#fff" : "var(--text-secondary)",
            border: isMyMessage ? "none" : "1px solid var(--border)",
            boxShadow: isMyMessage ? "0 2px 8px rgba(34,197,94,0.2)" : "none",
          }}
        >
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.message}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 ${isMyMessage ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            {formatTime(message.createdAt)}
          </span>
          {isMyMessage && (
            <CheckCheck
              className="w-3 h-3"
              style={{ color: isRead ? "#34b7f1" : "var(--text-muted)" }}
            />
          )}
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";