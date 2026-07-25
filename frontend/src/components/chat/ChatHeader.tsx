// components/chat/ChatHeader.tsx
"use client";

import { memo, useState } from "react";
import { ArrowLeft, Circle, User } from "lucide-react";
import Image from "next/image";

interface ChatHeaderProps {
  displayName: string;
  profileImage?: string;
  avatarInitial: string;
  isOnline: boolean;
  onBack?: () => void;
}

export const ChatHeader = memo(({ 
  displayName, 
  profileImage,
  avatarInitial, 
  isOnline, 
  onBack 
}: ChatHeaderProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="p-3 border-b flex-shrink-0" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="lg:hidden p-2 rounded-full transition-colors hover:bg-card-hover"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
        )}
        
        <div className="relative">
          {/* Profile Image */}
          {profileImage && !imageError ? (
            <Image
              src={profileImage}
              alt={displayName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-success/30 shadow-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            /* Fallback Avatar with Gradient */
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-inverse font-semibold text-sm shadow-lg">
              {avatarInitial || <User className="w-4 h-4" />}
            </div>
          )}
          
          {/* Online Status Indicator */}
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5">
              <div className="w-3.5 h-3.5 bg-success rounded-full border-2 border-card animate-pulse-dot" />
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-primary font-semibold">{displayName}</h2>
          <div className="flex items-center gap-1.5">
            <Circle
              className={`w-2 h-2 ${isOnline ? "text-success fill-success" : "text-muted fill-muted"}`}
            />
            <span className={`text-xs ${isOnline ? "text-success" : "text-muted"}`}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatHeader.displayName = "ChatHeader";