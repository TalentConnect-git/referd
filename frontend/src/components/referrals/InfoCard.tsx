// components/referrals/InfoCard.tsx
import React from 'react';

interface InfoCardProps {
  label: string;
  value?: string | number;
}

export const InfoCard: React.FC<InfoCardProps> = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--text-secondary)]">
        {value || "Not available"}
      </p>
    </div>
  );
};