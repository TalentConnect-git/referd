// components/profile/AwardCard.tsx
"use client";

import { Award } from "lucide-react";
import { ProfileData } from "@/types/profile";
import SectionCard from "./SectionCard";
import AwardItem from "@/components/achievements/AwardItem";

interface AwardCardProps {
  profile: ProfileData;
}

export default function AwardCard({ profile }: AwardCardProps) {
  const awards = profile.awards || [];

  return (
    <SectionCard title="Awards" icon={Award}>
      {awards.length > 0 ? (
        awards.map((item, index) => (
          <AwardItem
            key={item._id || `award-${index}`}
            item={item}
          />
        ))
      ) : (
        <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-6 text-center">
          <p className="text-[12px] text-[#7891c7]">No awards added yet</p>
        </div>
      )}
    </SectionCard>
  );
}