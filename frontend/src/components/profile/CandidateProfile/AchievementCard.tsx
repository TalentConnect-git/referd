// components/profile/AchievementCard.tsx
"use client";

import { Trophy } from "lucide-react";
import { ProfileData } from "@/types/profile";
import SectionCard from "./SectionCard";
import AchievementItem from "@/components/achievements/AchievementItem";

interface AchievementCardProps {
  profile: ProfileData;
}

export default function AchievementCard({ profile }: AchievementCardProps) {
  const achievements = profile.achievements || [];

  return (
    <SectionCard title="Achievements" icon={Trophy}>
      {achievements.length > 0 ? (
        achievements.map((item, index) => (
          <AchievementItem
            key={item._id || `achievement-${index}`}
            item={item}
          />
        ))
      ) : (
        <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-6 text-center">
          <p className="text-[12px] text-[#7891c7]">No achievements added yet</p>
        </div>
      )}
    </SectionCard>
  );
}