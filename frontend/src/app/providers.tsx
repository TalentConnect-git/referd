"use client";

import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthContextRole } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ChatProvider } from "@/context/ChatContext";

export default function Providers({ children }: { children: ReactNode }) {
 

  const appProviders = (
    <AuthContextRole>
      <SocketProvider>
        <NotificationProvider>
          <ChatProvider>{children}</ChatProvider>
        </NotificationProvider>
      </SocketProvider>
    </AuthContextRole>
  );

  

  return (
    <GoogleOAuthProvider clientId={process.env.Next_GOOGLE_CLIENT_ID}>
      {appProviders}
    </GoogleOAuthProvider>
  );
}