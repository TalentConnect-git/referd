// components/profile/PublicationCard.tsx
"use client";

import { BookOpen } from "lucide-react";
import { ProfileData } from "@/types/profile";
import SectionCard from "./SectionCard";
import PublicationItem from "@/components/achievements/PublicationItem";

interface PublicationCardProps {
  profile: ProfileData;
}

export default function PublicationCard({ profile }: PublicationCardProps) {
  const publications = profile.publications || [];

  return (
    <SectionCard title="Publications" icon={BookOpen}>
      {publications.length > 0 ? (
        publications.map((item, index) => (
          <PublicationItem
            key={item._id || `publication-${index}`}
            item={item}
          />
        ))
      ) : (
        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--background-soft)] px-4 py-6 text-center">
          <p className="text-xs text-[var(--text-muted)]">No publications added yet</p>
        </div>
      )}
    </SectionCard>
  );
}