"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MessageCircle, Paperclip, Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { Conversation, Message } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";

interface ChatAreaProps {
  conversation: Conversation | null;
  messages: Message[];
  messagesLoading: boolean;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  isPartnerOnline: boolean;
  getDisplayName: () => string;
  getAvatarInitial: () => string;
  formatMessageDate: (date: string) => string;
  formatMessageTime: (date: string) => string;
  onBack?: () => void;
  isCreatingConversation?: boolean;
}

export const ChatArea = memo(
  ({
    conversation,
    messages,
    messagesLoading,
    newMessage,
    onNewMessageChange,
    onSendMessage,
    isPartnerOnline,
    getDisplayName,
    getAvatarInitial,
    formatMessageDate,
    formatMessageTime,
    onBack,
    isCreatingConversation = false,
  }: ChatAreaProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);

      return () => clearTimeout(timeoutId);
    }, [messages]);

    useEffect(() => {
      if (!conversation) return;

      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);

      return () => clearTimeout(timeoutId);
    }, [conversation?._id]);

    const messageGroups = useMemo(() => {
      const groups: Record<string, Message[]> = {};

      messages.forEach((message) => {
        const date = new Date(message.createdAt).toDateString();

        if (!groups[date]) groups[date] = [];
        groups[date].push(message);
      });

      return groups;
    }, [messages]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          onSendMessage();
        }
      },
      [onSendMessage]
    );

    const handleEmojiClick = useCallback(
      (emojiData: any) => {
        onNewMessageChange(newMessage + emojiData.emoji);
        setShowEmojiPicker(false);
        inputRef.current?.focus();
      },
      [newMessage, onNewMessageChange]
    );

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (!showEmojiPicker) return;

        const target = event.target as HTMLElement;

        if (!target.closest(".emoji-picker-container")) {
          setShowEmojiPicker(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showEmojiPicker]);

    if (!conversation) {
      return (
        <div
          className="flex flex-1 items-center justify-center"
          style={{ background: "var(--background)" }}
        >
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] shadow-2xl">
              <MessageCircle className="h-12 w-12 text-white" />
            </div>

            <h2 className="mb-3 text-3xl font-bold text-white">
              Welcome to Messages
            </h2>

            <p className="max-w-sm text-[var(--text-muted)]">
              Select a conversation to start chatting
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="flex h-screen min-w-0 flex-1 flex-col"
        style={{ background: "var(--background)" }}
      >
        <ChatHeader
          displayName={getDisplayName()}
          avatarInitial={getAvatarInitial()}
          isOnline={isPartnerOnline}
          onBack={onBack}
        />

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messagesLoading && messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <MessageCircle className="mx-auto mb-4 h-16 w-16 text-[var(--text-muted)]" />
                <p className="text-lg font-medium text-white">No messages yet</p>
                <p className="text-sm text-[var(--text-muted)]">
                  Send your first message to {getDisplayName()}
                </p>
              </div>
            </div>
          ) : (
            Object.entries(messageGroups).map(([date, group]) => (
              <div key={date}>
                <div className="mb-4 flex justify-center">
                  <div className="glass-card rounded-full px-4 py-1.5">
                    <span className="text-xs font-medium text-[var(--text-muted)]">
                      {formatMessageDate(group[0].createdAt)}
                    </span>
                  </div>
                </div>

                {group.map((message) => (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    formatMessageTime={formatMessageTime}
                  />
                ))}
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>

        <div
          className="flex-shrink-0 border-t p-3"
          style={{
            borderColor: "var(--border)",
            background: "var(--card)",
          }}
        >
          <div className="mx-auto flex max-w-4xl items-center gap-2">
            <div className="emoji-picker-container relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker((value) => !value)}
                className="rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--card-hover)] hover:text-white"
              >
                <Smile className="h-5 w-5" />
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 z-50 mb-2 animate-slide-in-up">
                  <div
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
                    }}
                  >
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      width={320}
                      height={400}
                      searchPlaceholder="Search emojis..."
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--card-hover)] hover:text-white"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(event) => onNewMessageChange(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isCreatingConversation
                  ? "Creating conversation..."
                  : "Type a message..."
              }
              disabled={isCreatingConversation}
              className="flex-1 rounded-full border px-5 py-3 text-sm text-white transition-all placeholder:text-[var(--text-muted)] focus:outline-none disabled:opacity-50"
              style={{
                background: "var(--background)",
                borderColor: "var(--border)",
              }}
            />

            <button
              type="button"
              onClick={onSendMessage}
              disabled={!newMessage.trim() || isCreatingConversation}
              className={`rounded-full p-3 transition-all ${
                newMessage.trim() && !isCreatingConversation
                  ? "text-white hover:scale-105 active:scale-95"
                  : "cursor-not-allowed text-[var(--text-muted)]"
              }`}
              style={{
                background:
                  newMessage.trim() && !isCreatingConversation
                    ? "var(--primary)"
                    : "var(--card-hover)",
              }}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ChatArea.displayName = "ChatArea";