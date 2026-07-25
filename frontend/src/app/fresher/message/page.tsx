"use client";

import { MessageCircle } from "lucide-react";

export default function StudentMessagePage() {
  return (
    <div
      className="flex h-full flex-1 items-center justify-center"
      style={{ background: "var(--background)" }}
    >
      <div className="text-center">
        <MessageCircle className="mx-auto mb-4 h-20 w-20 text-muted" />

        <h2 className="mb-2 text-2xl font-bold text-primary">
          Select a conversation
        </h2>

        <p className="text-muted">
          Choose a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
}