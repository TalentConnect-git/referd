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
          "border-[#38e878]/25 bg-[#12381f] text-[#38e878]",
      };
    }

    if (isStudent) {
      return {
        label: "Student",
        icon: User,
        className:
          "border-blue-500/20 bg-blue-500/10 text-blue-400",
      };
    }

    if (isFresher) {
      return {
        label: "Fresher",
        icon: User,
        className:
          "border-amber-500/20 bg-amber-500/10 text-amber-400",
      };
    }

    return {
      label: "Not Set",
      icon: User,
      className:
        "border-[#1f2d3a] bg-[#0b1621] text-[#94a3b8]",
    };
  };

  const badge = getProfileBadge();
  const BadgeIcon = badge.icon;

  return (
    <header className="flex min-h-[72px] items-center justify-between gap-4 border-b border-[#1f2d3a] bg-[#071018] px-4 py-3 md:px-6">
      {/* Profile details */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#1f2d3a] bg-[#0b1621]">
          <User className="h-5 w-5 text-[#38e878]" />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-white md:text-lg">
            {userName}
          </h1>

          <div className="mt-1 flex items-center gap-2">
            <span className="hidden text-xs text-[#94a3b8] sm:inline">
              Account type
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${badge.className}`}
            >
              <BadgeIcon className="h-3 w-3" />
              {badge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh profile"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#1f2d3a] bg-[#0b1621] px-3 text-xs font-medium text-[#cbd5e1] transition-colors hover:border-[#38e878]/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
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
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#38e878] px-3 text-xs font-semibold text-[#071018] transition-colors hover:bg-[#2fd96d] disabled:cursor-not-allowed disabled:opacity-60 md:px-4"
          >
            {switching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Crown className="h-4 w-4" />
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
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#1f2d3a] bg-[#0b1621] px-3 text-xs font-medium text-[#cbd5e1] transition-colors hover:border-[#38e878]/30 hover:text-white md:px-4"
        >
          <Pencil className="h-4 w-4" />

          <span className="hidden sm:inline">Edit Profile</span>
          <span className="sm:hidden">Edit</span>
        </Link>
      </div>
    </header>
  );
}