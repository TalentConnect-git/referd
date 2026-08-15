// components/chat/ChatArea.tsx
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
import  MessageBubble  from "./MessageBubble";

interface ChatAreaProps {
  conversation: Conversation | null;
  messages: Message[];
  messagesLoading: boolean;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  isPartnerOnline: boolean;
  getDisplayName: () => string;
  getProfileImage?: () => string;
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
    getProfileImage,
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
          className="flex flex-1 items-center justify-center p-4"
          style={{ background: "var(--background)" }}
        >
          <div className="text-center max-w-sm px-4">
            <div 
              className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full shadow-2xl"
              style={{ background: "var(--primary-gradient)" }}
            >
              <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" style={{ color: "var(--inverse)" }} />
            </div>
            <h2 className="mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: "var(--primary)" }}>
              Welcome to Messages
            </h2>
            <p className="text-xs sm:text-sm md:text-base" style={{ color: "var(--muted)" }}>
              Select a conversation to start chatting
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden"
        style={{ background: "var(--background)" }}
      >
        <ChatHeader
          displayName={getDisplayName()}
          profileImage={getProfileImage ? getProfileImage() : ""}
          avatarInitial={getAvatarInitial()}
          isOnline={isPartnerOnline}
          onBack={onBack}
        />

        <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 space-y-3 sm:space-y-4 scrollbar-thin">
          {messagesLoading && messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center px-4">
                <MessageCircle className="mx-auto mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16" style={{ color: "var(--muted)" }} />
                <p className="text-base sm:text-lg font-medium" style={{ color: "var(--primary)" }}>No messages yet</p>
                <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
                  Send your first message to {getDisplayName()}
                </p>
              </div>
            </div>
          ) : (
            Object.entries(messageGroups).map(([date, group]) => (
              <div key={date}>
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <div 
                    className="rounded-full px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span className="text-[10px] sm:text-xs font-medium" style={{ color: "var(--muted)" }}>
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
          className="flex-shrink-0 border-t p-2 sm:p-3"
          style={{
            borderColor: "var(--border)",
            background: "var(--card)",
          }}
        >
          <div className="mx-auto flex max-w-4xl items-center gap-1.5 sm:gap-2">
            <div className="emoji-picker-container relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker((value) => !value)}
                className="rounded-full p-1.5 sm:p-2 transition-colors hover:bg-card-hover hover:text-primary"
                style={{ color: "var(--muted)" }}
                aria-label="Open emoji picker"
              >
                <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 z-50 mb-2 animate-slide-in-up">
                  <div
                    className="emoji-picker-wrapper"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "var(--shadow-xl)",
                    }}
                  >
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      width={Math.min(320, typeof window !== 'undefined' ? window.innerWidth - 32 : 320)}
                      height={400}
                      searchPlaceholder="Search emojis..."
                    />
                  </div>
                </div>
              )}
            </div>

           

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
              className="flex-1 rounded-full border px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-primary transition-all placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              style={{
                background: "var(--background)",
                borderColor: "var(--border)",
              }}
            />

            <button
              type="button"
              onClick={onSendMessage}
              disabled={!newMessage.trim() || isCreatingConversation}
              className={`rounded-full p-2 sm:p-3 transition-all ${
                newMessage.trim() && !isCreatingConversation
                  ? "hover:scale-105 active:scale-95"
                  : "cursor-not-allowed opacity-50"
              }`}
              style={{
                background:
                  newMessage.trim() && !isCreatingConversation
                    ? "var(--primary)"
                    : "var(--card-hover)",
                color: newMessage.trim() && !isCreatingConversation
                  ? "var(--inverse)"
                  : "var(--muted)",
              }}
              aria-label="Send message"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ChatArea.displayName = "ChatArea";