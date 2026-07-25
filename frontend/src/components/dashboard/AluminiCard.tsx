import { AlumniCardProps } from "@/types/dashboard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  MessageCircle,
  Briefcase,
  GraduationCap,
  Building2,
  User,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function AlumniCard({
  name,
  role,
  company,
  college,
  openRoles,
  userId,
  profileImage,
  onClick,
}: AlumniCardProps) {
  const [imageError, setImageError] = useState(false);

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const { role: userType } = useAuth();
  const router = useRouter();

  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imageUrl = profileImage || "";
    router.push(
      `/${userType}/message/${userId}?userName=${encodeURIComponent(name)}&profileImage=${encodeURIComponent(imageUrl)}`
    );
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="surface-card group rounded-xl p-4 transition-all duration-200 hover:border-[var(--primary-border)] hover:shadow-md cursor-pointer"
    >
      <div className="flex items-start gap-3">
        {/* Profile Image */}
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-[var(--border)] transition-colors duration-200 group-hover:border-[var(--primary-border)]">
          {profileImage && !imageError ? (
            <Image
              src={profileImage}
              alt={name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[var(--primary-soft)]">
              <span className="text-sm font-semibold text-[var(--primary)]">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary)]">
              {name}
            </h3>
            {openRoles > 0 && (
              <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)] px-2 py-0.5 text-[9px] font-medium text-[var(--primary)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--primary)]"></span>
                {openRoles}
              </span>
            )}
          </div>

          <div className="mt-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 flex-shrink-0 text-[var(--text-muted)]" />
              <p className="truncate text-xs text-[var(--text-secondary)]">
                {role} {company && <span className="text-[var(--text-muted)]">•</span>} {company}
              </p>
            </div>

            {college && (
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 flex-shrink-0 text-[var(--text-muted)]" />
                <p className="truncate text-xs text-[var(--text-muted)]">{college}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Button - Fixed with proper border visibility */}
      <button
        onClick={handleMessageClick}
        className="
          mt-3 inline-flex w-full items-center justify-center gap-2 
          rounded-lg border-2 px-3 py-2 text-xs font-medium 
          transition-all duration-200 
          hover:scale-[1.02] active:scale-[0.98]
          border-[var(--border)] 
          bg-[var(--card)] 
          text-[var(--text-secondary)]
          hover:border-[var(--primary-border)] 
          hover:bg-[var(--primary-soft)] 
          hover:text-[var(--primary)]
        "
      >
        <MessageCircle className="h-3.5 w-3.5" />
        Message
      </button>
    </div>
  );
}