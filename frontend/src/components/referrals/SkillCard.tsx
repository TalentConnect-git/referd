// components/referrals/SkillCard.tsx
import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { Chip } from './Chip';

interface SkillCardProps {
  title: string;
  skills?: string[];
  variant?: 'default' | 'success' | 'danger' | 'primary';
  emptyText?: string;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  title,
  skills = [],
  variant = "default",
  emptyText = "No skills found.",
}) => {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <Chip key={skill} variant={variant}>
              {variant === "success" && <BadgeCheck size={12} />}
              {skill}
            </Chip>
          ))
        ) : (
          <p className="text-sm text-[var(--text-primary)]">{emptyText}</p>
        )}
      </div>
    </div>
  );
};