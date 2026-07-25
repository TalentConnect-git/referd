// components/profile/InternationalExperienceCard.tsx
"use client";

import { Globe2 } from "lucide-react";
import { ProfileData } from "@/types/profile";
import SectionCard from "./SectionCard";
import InternationalExperienceItem from "@/components/achievements/InternationalExperienceItem";

interface InternationalExperienceCardProps {
  profile: ProfileData;
}

export default function InternationalExperienceCard({ profile }: InternationalExperienceCardProps) {
  const experiences = profile.internationalExperience || [];

  return (
    <SectionCard title="International Experience" icon={Globe2}>
      {experiences.length > 0 ? (
        experiences.map((item, index) => (
          <InternationalExperienceItem
            key={item._id || `international-${index}`}
            item={item}
          />
        ))
      ) : (
        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--background-soft)] px-4 py-6 text-center">
          <p className="text-xs text-[var(--text-muted)]">No international experience added yet</p>
        </div>
      )}
    </SectionCard>
  );
}