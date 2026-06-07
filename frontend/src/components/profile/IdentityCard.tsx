// IdentityCard.tsx
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import Badge from "./Badge";
import { ProfileData } from "@/types/profile";

interface IdentityCardProps {
  profile: ProfileData;
  initials?: string;
  headline: string;
  currentRoleLine: string;
}

const getInitials = (name?: string) => {
  if (!name) return "U";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "U";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export default function IdentityCard({
  profile,
  initials,
  headline,
  currentRoleLine,
}: IdentityCardProps) {
  const displayName = profile.fullName || profile.name || "User";

  const profileInitials = initials || getInitials(displayName);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
      <div className="flex items-center gap-6">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--primary-soft)] text-3xl font-bold text-[var(--primary)]">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{profileInitials}</span>
          )}
        </div>

        <div>
          <h2 className="text-[24px] font-bold text-white">
            {displayName}
          </h2>

          <p className="mt-2 text-[15px] text-[var(--text-primary)]">
            {headline}
          </p>

          {currentRoleLine && (
            <p className="mt-1 text-[14px] text-[var(--text-primary)]">
              {currentRoleLine}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge icon={<ShieldCheck />} text="Verified alumni" />

            <Badge
              icon={<CheckCircle2 />}
              text={
                profile.emailVerified
                  ? "Email verified"
                  : "Email not verified"
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--border)] pt-6">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-white">
            Profile completion
          </span>
          <span className="text-[var(--primary)]">82%</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[82%] rounded-full bg-[var(--primary)]" />
        </div>
      </div>
    </div>
  );
}