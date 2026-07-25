// ProfileHeader.tsx
"use client";

import Link from "next/link";
import {
  Crown,
  Loader2,
  Pencil,
  RefreshCw,
  User,
} from "lucide-react";

interface ProfileHeaderProps {
  editHref: string;
  profileType?: string;
  switching: boolean;
  onSwitchToProfessional: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  userName?: string;
}

export default function ProfileHeader({
  editHref,
  profileType,
  switching,
  onSwitchToProfessional,
  onRefresh,
  isRefreshing = false,
  userName = "User",
}: ProfileHeaderProps) {
  const normalizedProfileType = profileType?.toLowerCase();

  const isProfessional = normalizedProfileType === "professional";
  const isStudent = normalizedProfileType === "student";
  const isFresher = normalizedProfileType === "fresher";

  const getProfileBadge = () => {
    if (isProfessional) {
      return {
        label: "Professional",
        icon: Crown,
        className:
          "border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]",
      };
    }

    if (isStudent) {
      return {
        label: "Student",
        icon: User,
        className:
          "border-[var(--info-border)] bg-[var(--info-soft)] text-[var(--info)]",
      };
    }

    if (isFresher) {
      return {
        label: "Fresher",
        icon: User,
        className:
          "border-[var(--warning-border)] bg-[var(--warning-soft)] text-[var(--warning)]",
      };
    }

    return {
      label: "Not Set",
      icon: User,
      className:
        "border-[var(--border)] bg-[var(--background-soft)] text-[var(--text-muted)]",
    };
  };

  const badge = getProfileBadge();
  const BadgeIcon = badge.icon;

  return (
    <header className="flex min-h-[72px] flex-col items-start justify-between gap-3 border-b border-[var(--border)] bg-[var(--background-soft)] px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-4 md:px-6 md:py-4">
      {/* Profile details */}
      <div className="flex min-w-0 w-full flex-1 items-center gap-3 sm:w-auto">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background-soft)] sm:h-10 sm:w-10">
          <User className="h-4 w-4 text-[var(--primary)] sm:h-5 sm:w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold text-[var(--text-primary)] sm:text-base md:text-lg">
            {userName}
          </h1>

          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 sm:mt-1 sm:gap-2">
            <span className="hidden text-xs text-[var(--text-muted)] sm:inline">
              Account type
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium sm:gap-1.5 sm:px-2.5 sm:py-0.5 sm:text-[11px] ${badge.className}`}
            >
              <BadgeIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              {badge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full shrink-0 flex-wrap items-center gap-1.5 sm:w-auto sm:gap-2">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh profile"
            className="btn-secondary inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 text-[10px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--primary-border)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:flex-none sm:gap-2 sm:px-3 sm:text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />

            <span className="hidden md:inline">
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        )}

        {!isProfessional && (
          <button
            type="button"
            onClick={onSwitchToProfessional}
            disabled={switching}
            className="btn-primary inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-2.5 text-[10px] font-semibold text-black transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:h-9 sm:flex-none sm:gap-2 sm:px-3 sm:text-xs md:px-4"
          >
            {switching ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
            ) : (
              <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}

            <span className="hidden sm:inline">
              {switching
                ? "Switching..."
                : "Switch to Professional"}
            </span>

            <span className="sm:hidden">
              {switching ? "Wait..." : "Switch"}
            </span>
          </button>
        )}

        <Link
          href={editHref}
          className="btn-secondary inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 text-[10px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--primary-border)] hover:text-[var(--primary)] sm:h-9 sm:flex-none sm:gap-2 sm:px-3 sm:text-xs md:px-4"
        >
          <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

          <span className="hidden sm:inline">Edit Profile</span>
          <span className="sm:hidden">Edit</span>
        </Link>
      </div>
    </header>
  );
}