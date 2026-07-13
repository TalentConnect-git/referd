// ProfileHeader.tsx
import Link from 'next/link';
import { Pencil, User, UserCog, Loader2, ArrowRight, Sparkles } from 'lucide-react';

interface ProfileHeaderProps {
  editHref: string;
  profileType?: string;
  switching: boolean;
  onSwitchToProfessional: () => void;
}

export default function ProfileHeader({
  editHref,
  profileType,
  switching,
  onSwitchToProfessional,
}: ProfileHeaderProps) {
  const isProfessional = profileType === 'professional';
  const isStudent = profileType === 'student';

  return (
    <header className="flex min-h-[80px] items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-6 py-0 md:px-8">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10">
          <User className="h-5 w-5 text-[var(--primary)]" />
        </div>
        <div>
          <h1 className="text-[18px] font-bold text-white md:text-[20px]">
            Profile
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[var(--text-muted)]">
              {profileType ? `Account type: ${profileType}` : 'Complete your profile'}
            </span>
            {profileType && (
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
            )}
            <span className="text-[11px] font-medium text-[var(--primary)] capitalize">
              {profileType || 'Not set'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Switch to Professional Button */}
        {!isProfessional && !isStudent && (
          <button
            onClick={onSwitchToProfessional}
            disabled={switching}
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 px-4 py-2.5 text-[13px] font-semibold text-[var(--primary)] transition-all duration-300 hover:bg-[var(--primary)]/10 hover:shadow-lg hover:shadow-[var(--primary)]/10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            
            <span className="hidden sm:inline">
              {switching ? 'Switching...' : 'Switch to Professional'}
            </span>
            <span className="inline sm:hidden">
              {switching ? 'Switching...' : 'Switch'}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            
            {switching && (
              <Loader2 className="absolute inset-0 m-auto h-5 w-5 animate-spin text-[var(--primary)]" />
            )}
          </button>
        )}

        {/* Edit Profile Button */}
        <Link
          href={editHref}
          className="group flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:border-[var(--primary)]/30 hover:bg-[var(--card-hover)] hover:shadow-lg hover:shadow-[var(--primary)]/5"
        >
          <Pencil className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="hidden sm:inline">Edit Profile</span>
          <span className="inline sm:hidden">Edit</span>
        </Link>
      </div>
    </header>
  );
}