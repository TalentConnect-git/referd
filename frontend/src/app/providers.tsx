"use client";

import { AuthContextRole } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ChatProvider } from "@/context/ChatContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <AuthContextRole>
  <SocketProvider>
    <NotificationProvider>
      <ChatProvider>
            {children}
          </ChatProvider>
    </NotificationProvider>
  </SocketProvider>
</AuthContextRole>
  )
}




