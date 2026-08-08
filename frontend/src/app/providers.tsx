"use client";

import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthContextRole } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ChatProvider } from "@/context/ChatContext";
import { ThemeProvider } from "@/context/ThemeContext";

import CareerInsightPopup from "@/components/career/CareerInsightPopup";

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  const appProviders = (
    <ThemeProvider>
      <AuthContextRole>
        <SocketProvider>
          <NotificationProvider>
            <ChatProvider>
              {children}

              {/* Career popup has access to useAuth() */}
              <CareerInsightPopup />
            </ChatProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthContextRole>
    </ThemeProvider>
  );

  return (
    <GoogleOAuthProvider
      clientId={
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
      }
    >
      {appProviders}
    </GoogleOAuthProvider>
  );
}