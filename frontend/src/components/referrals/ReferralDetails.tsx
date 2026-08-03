"use client";

import { useEffect, useState } from "react";
import { ReferralDetailsProps } from "@/types/referral";
import ReferralDetailsCandidates from "./ReferralDetailsCandidates";
import ReferralDetailsOverview from "./ReferralDetailsOverview";
import ReferralDetailsHeader from "./ReferralDetailsHeader";
import { X } from "lucide-react";

type ReferralDetailsTab = "candidates" | "overview";

type ReferralDetailsExtraProps = ReferralDetailsProps & {
  initialTab?: ReferralDetailsTab;
};

export default function ReferralDetails({
  referral,
  onClose,
  initialTab = "candidates",
}: ReferralDetailsExtraProps) {
  const [activeTab, setActiveTab] = useState<ReferralDetailsTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="modal-overlay fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-overlay backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            modal-content relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl
            border border-theme bg-card p-5 shadow-xl
          "
        >
          <button
            type="button"
            onClick={onClose}
            className=" absolute right-3 top-1 text-muted transition-colors hover:text-primary"
          >
            <X size={18} />
          </button>

          {/* Pass setActiveTab to header */}
          <ReferralDetailsHeader 
            referral={referral} 
            setActiveTab={setActiveTab}
          />

          {/* Tab Buttons */}
          <div className="mb-4 flex w-fit rounded-lg bg-background-soft p-1">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeTab === "overview"
                  ? "btn-primary bg-gradient-to-r from-primary to-primary-light text-inverse"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Overview
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("candidates")}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeTab === "candidates"
                  ? "btn-primary bg-gradient-to-r from-primary to-primary-light text-inverse"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Candidates
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <ReferralDetailsOverview referral={referral} />
          )}

          {activeTab === "candidates" && (
            <ReferralDetailsCandidates referral={referral} />
          )}
        </div>
      </div>
    </div>
  );
}