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
    // Switch to Overview tab when job title is clicked
    if (setActiveTab) {
      setActiveTab("overview");
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 border-b border-divider pb-3 mb-3">
      <div className="min-w-0">
        <h1 
          onClick={handleJobTitleClick}
          className="text-base font-bold text-primary truncate cursor-pointer hover:text-primary transition-colors duration-200"
        >
          {referral.jobTitle?.[0] || "Untitled Job"}
        </h1>
        <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-muted" />
          {getLocation()}
        </p>
      </div>

      <span
        className={`
          badge
          rounded-full px-3 py-0.5 
          text-[11px] font-medium 
          border 
          transition-all duration-200
          flex items-center gap-1.5
          ${
            referral.inactive
              ? "border-theme text-muted bg-background-soft hover:bg-card-hover"
              : "badge-success hover:border-success/50"
          }
        `}
      >
        <span
          className={`
            inline-block w-1.5 h-1.5 rounded-full
            ${referral.inactive ? "bg-muted" : "bg-success animate-pulse"}
          `}
        />
        {referral.inactive ? "Closed" : "Live"}
      </span>
    </div>
  );
}