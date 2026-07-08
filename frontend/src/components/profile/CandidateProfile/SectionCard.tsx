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
    <section className="rounded-[18px] border border-white/10 bg-[#071018] px-[18px] py-[18px] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#12381f] text-[#37e875]">
          <Icon className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-[14px] font-bold text-white">{title}</h2>
      </div>

      <div className="mt-[18px] border-t border-white/10" />

      <div className="mt-[17px] space-y-4">{children}</div>
    </section>
  );
}