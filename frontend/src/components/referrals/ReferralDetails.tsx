"use client";

import { useState } from "react";
import { ReferralDetailsProps } from "@/types/referral";
import ReferralDetailsCandidates from "./ReferralDetailsCandidates";
import ReferralDetailsOverview from "./ReferralDetailsOverview";
import ReferralDetailsHeader from "./ReferralDetailsHeader";

export default function ReferralDetails({
  referral,
  onClose,
}: ReferralDetailsProps) {
  const [activeTab, setActiveTab] = useState< "overview" | "candidates">("overview");

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            relative
            w-full
            max-w-5xl
            h-[85vh]
            overflow-y-auto
            rounded-3xl
            border
            border-[var(--border)]
            bg-[var(--card)]
            shadow-2xl
            p-8
          "
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>

          {/* Header */}
         <ReferralDetailsHeader referral={referral} />

          {/* Tabs */}
          <div className="flex rounded-xl bg-slate-800 p-1 w-fit mb-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-2 rounded-lg transition ${
                activeTab === "overview"
                  ? "bg-green-500 text-black font-semibold"
                  : "text-gray-300"
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab("candidates")}
              className={`px-6 py-2 rounded-lg transition ${
                activeTab === "candidates"
                  ? "bg-green-500 text-black font-semibold"
                  : "text-gray-300"
              }`}
            >
              Candidates
            </button>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <ReferralDetailsOverview referral={referral}/>
          )}

          {/* CANDIDATES TAB */}
          {activeTab === "candidates" && (
                <ReferralDetailsCandidates referral={referral}/>)}
        </div>
      </div>
    </div>
  );
}