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
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl
            border border-[#1e293b] bg-[#111827] p-5 shadow-2xl
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-400 transition-colors hover:text-white"
          >
            <X size={18} />
          </button>

          <ReferralDetailsHeader referral={referral} />

          <div className="mb-4 flex w-fit rounded-lg bg-[#1e293b] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Overview
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("candidates")}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeTab === "candidates"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Candidates
            </button>
          </div>

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
