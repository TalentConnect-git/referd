// components/profile/LeadershipCard.tsx
"use client";

import { Users } from "lucide-react";
import { ProfileData } from "@/types/profile";
import SectionCard from "./SectionCard";
import LeadershipItem from "@/components/achievements/LeadershipItem";

interface LeadershipCardProps {
  profile: ProfileData;
}

export default function LeadershipCard({ profile }: LeadershipCardProps) {
  const leadership = profile.leadership || [];

  return (
    <SectionCard title="Leadership" icon={Users}>
      {leadership.length > 0 ? (
        leadership.map((item, index) => (
          <LeadershipItem
            key={item._id || `leadership-${index}`}
            item={item}
          />
        ))
      ) : (
        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--background-soft)] px-4 py-6 text-center">
          <p className="text-xs text-[var(--text-muted)]">No leadership roles added yet</p>
        </div>
      )}
    </SectionCard>
  );
}