// components/achievements/EmptyItem.tsx
"use client";

interface EmptyItemProps {
  text: string;
}

export default function EmptyItem({ text }: EmptyItemProps) {
  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--background-soft)] px-4 py-4">
      <p className="text-xs font-normal text-[var(--text-muted)]">{text}</p>
    </div>
  );
}