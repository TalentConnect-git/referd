// components/achievements/SectionCard.tsx
"use client";

import type React from "react";

interface SectionCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

export default function SectionCard({ title, icon: Icon, children }: SectionCardProps) {
  return (
    <section className="surface-card rounded-[18px] border border-[var(--border)] bg-[var(--card)] p-[18px] shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)]">
          <Icon className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-sm font-bold text-[var(--text-primary)]">{title}</h2>
      </div>

      <div className="mt-[18px] border-t border-[var(--border)]" />

      <div className="mt-[17px] space-y-4">{children}</div>
    </section>
  );
}