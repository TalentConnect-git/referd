"use client";

import { ReferralJob, ReferralDetailsHeaderProps } from "@/types/referral";
import { MapPin } from "lucide-react";

type ReferralDetailsTab = "candidates" | "overview";

type ReferralDetailsHeaderPropsWithTab = ReferralDetailsHeaderProps & {
  setActiveTab?: (tab: ReferralDetailsTab) => void;
};

export default function ReferralDetailsHeader({
  referral,
  setActiveTab,
}: ReferralDetailsHeaderPropsWithTab) {
  // Get location display
  const getLocation = () => {
    if (referral.location?.[0]) return referral.location[0];
    
    return "Location not specified";
  };

  const handleJobTitleClick = () => {
    // ✅ Switch to Overview tab when job title is clicked
    if (setActiveTab) {
      setActiveTab("overview");
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 border-b border-[#1e293b] pb-3 mb-3">
      <div className="min-w-0">
        <h1 
          onClick={handleJobTitleClick}
          className="text-base font-bold text-white truncate cursor-pointer hover:text-green-400 transition-colors duration-200"
        >
          {referral.jobTitle?.[0] || "Untitled Job"}
        </h1>
        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-gray-500" />
          {getLocation()}
        </p>
      </div>

      <span
        className={`
          rounded-full px-3 py-0.5 
          text-[11px] font-medium 
          border 
          transition-all duration-200
          flex items-center gap-1.5
          ${
            referral.inactive
              ? "border-gray-600 text-gray-400 bg-gray-900/40 hover:bg-gray-900/60"
              : "border-green-500/30 text-green-400 bg-green-900/20 hover:bg-green-900/30 hover:border-green-500/50"
          }
        `}
      >
        <span
          className={`
            inline-block w-1.5 h-1.5 rounded-full
            ${referral.inactive ? "bg-gray-500" : "bg-green-400 animate-pulse"}
          `}
        />
        {referral.inactive ? "Closed" : "Live"}
      </span>
    </div>
  );
}