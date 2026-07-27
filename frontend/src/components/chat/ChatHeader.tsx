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
    <div 
      className="p-2 sm:p-3 border-b flex-shrink-0"
      style={{ 
        borderColor: "var(--border)", 
        background: "var(--card)" 
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 max-w-4xl mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="lg:hidden p-1.5 sm:p-2 rounded-full transition-colors hover:bg-card-hover"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </button>
        )}
        
        <div className="relative flex-shrink-0">
          {profileImage && !imageError ? (
            <Image
              src={profileImage}
              alt={displayName}
              width={36}
              height={36}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 shadow-lg"
              style={{ 
                borderColor: isOnline ? "var(--success)" : "var(--border)",
                borderWidth: "2px"
              }}
              onError={() => setImageError(true)}
              priority
            />
          ) : (
            <div 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-inverse font-semibold text-xs sm:text-sm shadow-lg"
              style={{
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              }}
            >
              {avatarInitial || <User className="w-3 h-3 sm:w-4 sm:h-4" />}
            </div>
          )}
          
          {/* Online Status Green Dot - Fixed for both themes */}
          <div className="absolute -bottom-0.5 -right-0.5">
            <div 
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 ${
                isOnline ? "bg-success" : "bg-muted"
              }`}
              style={{
                borderColor: "var(--card)",
                backgroundColor: isOnline ? "var(--success)" : "var(--text-muted)",
              }}
            />
          </div>
        </div>
        
        <div className="min-w-0 flex-1">
          <h2 
            className="text-sm sm:text-base font-semibold truncate text-primary"
          >
            {displayName}
          </h2>
          <div className="flex items-center gap-1.5">
            
            <span 
              className="text-[10px] sm:text-xs truncate"
              style={{ 
                color: isOnline ? "var(--success)" : "var(--text-muted)"
              }}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatHeader.displayName = "ChatHeader";