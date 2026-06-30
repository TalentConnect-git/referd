// app/professional/message/page.tsx
"use client";

import { MessageCircle } from "lucide-react";

export default function MessagePage() {
  return (
    <div className="flex-1 flex items-center justify-center" style={{ background: "var(--background)" }}>
      <div className="text-center">
        <MessageCircle className="w-20 h-20 text-[var(--text-muted)] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Select a conversation</h2>
        <p className="text-[var(--text-muted)]">Choose a conversation from the sidebar to start chatting</p>
      </div>
    </div>
  );
}