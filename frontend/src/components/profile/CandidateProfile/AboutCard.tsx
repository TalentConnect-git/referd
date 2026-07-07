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
    <section className="rounded-[18px] border border-white/10 bg-[#071018] px-[18px] py-[18px] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#12381f] text-[#37e875]">
          <User className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-[14px] font-black text-white">About</h2>
      </div>

      <div className="mt-[18px] border-t border-white/10" />

      <div className="mt-[17px] rounded-[14px] border border-white/7 bg-[#0b1621]/90 px-4 py-4">
        <p className="whitespace-pre-line text-[13px] font-medium leading-7 text-[#b3bdc9]">
          {aboutText}
        </p>
      </div>
    </section>
  );
}