"use client";

import { AuthContextRole } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { NotificationProvider } from "@/context/NotificationContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <AuthContextRole>
  <SocketProvider>
    <NotificationProvider>
      {children}
    </NotificationProvider>
  </SocketProvider>
</AuthContextRole>
  )
}




