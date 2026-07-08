// components/achievements/EmptyItem.tsx
"use client";

interface EmptyItemProps {
  text: string;
}

export default function EmptyItem({ text }: EmptyItemProps) {
  return (
    <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
      <p className="text-[12px] font-normal text-[#7891c7]">{text}</p>
    </div>
  );
}