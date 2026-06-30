// app/professional/message/page.tsx
'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function MessagePage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#070b12] h-full">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2fb344] to-[#1d7a2e] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#2fb344]/20">
          <MessageCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Welcome to Messages</h2>
        <p className="text-slate-400 max-w-sm">
          Select a conversation from the sidebar to start chatting with your connections
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span>💬</span>
          <span>End-to-end encrypted</span>
          <span>🔒</span>
        </div>
      </div>
    </div>
  );
}