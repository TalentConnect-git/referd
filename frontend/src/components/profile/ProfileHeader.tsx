// ProfileHeader.tsx
import Link from 'next/link';

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
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-[var(--border)] px-8">
      <h1 className="text-[16px] font-semibold">Profile</h1>
      <div className="flex items-center gap-3">
        {profileType !== 'professional' && profileType !== 'student' && (
          <button
            onClick={onSwitchToProfessional}
            disabled={switching}
            className="rounded-lg border border-[var(--primary)] bg-transparent px-4 py-2 text-[13px] font-semibold text-[var(--primary)] hover:bg-[var(--primary-soft)] disabled:opacity-60"
          >
            {switching ? 'Switching...' : 'Switch to Professional'}
          </button>
        )}
        <Link
          href={editHref}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[var(--card-hover)]"
        >
          Edit profile
        </Link>
      </div>
    </header>
  );
}