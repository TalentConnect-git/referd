// components/referrals/Chip.tsx
import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'primary' | 'info';
}

export const Chip: React.FC<ChipProps> = ({ children, variant = "default" }) => {
  const cls =
    variant === "success"
      ? "badge-success"
      : variant === "danger"
      ? "badge-danger"
      : variant === "primary"
      ? "badge-primary"
      : variant === "info"
      ? "badge-info"
      : "badge";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
};