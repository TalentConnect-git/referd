"use client";

import { User } from "lucide-react";
import { ProfileData } from "@/types/profile";

interface AboutCardProps {
  profile: ProfileData;
}

const getAboutText = (profile: ProfileData) => {
  const about = profile.about?.trim();

  if (!about) {
    return "No about information provided.";
  }

  return about;
};

export default function AboutCard({ profile }: AboutCardProps) {
  const aboutText = getAboutText(profile);

  return (
    <section className="surface-card rounded-[18px] border border-[var(--border)] bg-[var(--card)] p-[18px] shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)]">
          <User className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-sm font-bold text-[var(--text-primary)]">About</h2>
      </div>

      <div className="mt-[18px] border-t border-[var(--border)]" />

      <div className="mt-[17px] rounded-[14px] border border-[var(--border)] bg-[var(--background-soft)] px-4 py-4">
        <p className="whitespace-pre-line text-sm font-medium leading-7 text-[var(--text-secondary)]">
          {aboutText}
        </p>
      </div>
    </section>
  );
}