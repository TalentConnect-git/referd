"use client";

import { MessageCircle } from "lucide-react";

export default function StudentMessagePage() {
  return (
    <div 
      className="flex h-full w-full flex-1 items-center justify-center min-h-[400px]"
      style={{ background: "var(--background)" }}
    >
      <div className="flex flex-col items-center justify-center text-center px-6 py-8 max-w-md w-full">
        {/* Icon with container */}
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-background-soft border border-theme shadow-md">
          <MessageCircle className="h-10 w-10 text-muted" />
        </div>

        {/* Heading */}
        <h2 className="mb-2 text-xl font-bold text-primary">
          Select a conversation
        </h2>

        {/* Description */}
        <p className="text-sm text-muted max-w-xs">
          Choose a conversation from the sidebar to start chatting
        </p>

        {/* Subtle indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-12 h-px bg-divider"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
          <div className="w-12 h-px bg-divider"></div>
        </div>
      </div>
    </div>
  );
}