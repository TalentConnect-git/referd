// components/chat/ChatArea.tsx
"use client";

import { memo, useRef, useEffect, useMemo, useCallback, useState } from "react";
import { MessageCircle, Send, Paperclip, Smile } from "lucide-react";
import { Message, Conversation } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import EmojiPicker from "emoji-picker-react";

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

export const ChatArea = memo(({
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

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [messages]);

  // Auto-focus input when conversation changes
  useEffect(() => {
    if (conversation) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [conversation]);

  // Group messages by date
  const messageGroups = useMemo(() => {
    const groups: Record<string, Message[]> = {};
    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  }, [messages]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  }, [onSendMessage]);

  const handleEmojiClick = useCallback((emojiData: any) => {
    onNewMessageChange(newMessage + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }, [newMessage, onNewMessageChange]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showEmojiPicker) {
        const target = e.target as HTMLElement;
        if (!target.closest(".emoji-picker-container")) {
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  // If no conversation selected, show welcome screen
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Welcome to Messages</h2>
          <p className="text-[var(--text-muted)] max-w-sm">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen" style={{ background: "var(--background)" }}>
      <ChatHeader
        displayName={getDisplayName()}
        avatarInitial={getAvatarInitial()}
        isOnline={isPartnerOnline}
        onBack={onBack}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
              <p className="text-white font-medium text-lg">No messages yet</p>
              <p className="text-[var(--text-muted)] text-sm">Send your first message to {getDisplayName()}</p>
            </div>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex justify-center mb-4">
                <div className="px-4 py-1.5 rounded-full glass-card">
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    {formatMessageDate(msgs[0].createdAt)}
                  </span>
                </div>
              </div>
              {msgs.map((msg) => (
                <MessageBubble key={msg._id} message={msg} formatMessageTime={formatMessageTime} />
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 border-t flex-shrink-0" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <div className="relative emoji-picker-container">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-full transition-colors text-[var(--text-muted)] hover:text-white hover:bg-[var(--card-hover)]"
            >
              <Smile className="w-5 h-5" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2 left-0 z-50 animate-slide-in-up">
                <div
                  className="emoji-picker-wrapper"
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

          <button className="p-2 rounded-full transition-colors text-[var(--text-muted)] hover:text-white hover:bg-[var(--card-hover)]">
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isCreatingConversation ? "Creating conversation..." : "Type a message..."}
            disabled={isCreatingConversation}
            className="flex-1 text-white text-sm rounded-full px-5 py-3 border focus:outline-none transition-all placeholder:text-[var(--text-muted)] disabled:opacity-50"
            style={{ background: "var(--background)", borderColor: "var(--border)" }}
          />

          <button
            onClick={onSendMessage}
            disabled={!newMessage.trim() || isCreatingConversation}
            className={`p-3 rounded-full transition-all ${
              newMessage.trim() && !isCreatingConversation
                ? "text-white hover:scale-105 active:scale-95"
                : "text-[var(--text-muted)] cursor-not-allowed"
            }`}
            style={{
              background: newMessage.trim() && !isCreatingConversation ? "var(--primary)" : "var(--card-hover)",
            }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

ChatArea.displayName = "ChatArea";