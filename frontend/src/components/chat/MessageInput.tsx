// components/chat/MessageInput.tsx
'use client';

import { memo, forwardRef } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput = memo(forwardRef<HTMLInputElement, MessageInputProps>(({
  value,
  onChange,
  onSend,
  onKeyDown,
  placeholder = "Type a message...",
  disabled = false
}, ref) => {
  return (
    <div className="p-4 border-t border-[#242d3a] bg-[#111821] flex-shrink-0">
      <div className="flex gap-3">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-[#070b12] text-white text-sm rounded-xl px-4 py-3 border border-[#242d3a] focus:border-[#2fb344] focus:outline-none transition-colors placeholder:text-slate-500 disabled:opacity-50"
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 ${
            value.trim() && !disabled
              ? "bg-[#2fb344] text-white hover:bg-[#259a3a] hover:scale-105 active:scale-95"
              : "bg-[#1a2430] text-slate-500 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
}));

MessageInput.displayName = 'MessageInput';