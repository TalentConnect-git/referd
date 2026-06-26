// components/referrals/Chip.tsx
import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'primary' | 'info';
}

export const Chip: React.FC<ChipProps> = ({ children, variant = "default" }) => {
  const cls =
    variant === "success"
      ? "border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.12)] text-[#86efac]"
      : variant === "danger"
      ? "border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.10)] text-[#fca5a5]"
      : variant === "primary"
      ? "border-[rgba(49,170,64,0.35)] bg-[var(--primary-soft)] text-[var(--primary)]"
      : variant === "info"
      ? "border-[rgba(99,179,237,0.25)] bg-[rgba(99,179,237,0.10)] text-[#90cdf4]"
      : "border-[var(--border)] bg-[rgba(148,163,184,0.08)] text-[var(--text-primary)]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
};