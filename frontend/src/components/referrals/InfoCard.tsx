// components/referrals/InfoCard.tsx
import React from 'react';

interface InfoCardProps {
  label: string;
  value?: string | number;
}

export const InfoCard: React.FC<InfoCardProps> = ({ label, value }) => {
  return (
    <div className="card rounded-2xl p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-secondary">
        {value || "Not available"}
      </p>
    </div>
  );
};