"use client";

import { useState } from "react";
import { ReferralDetailsProps } from "@/types/referral";
import ReferralDetailsCandidates from "./ReferralDetailsCandidates";
import ReferralDetailsOverview from "./ReferralDetailsOverview";
import ReferralDetailsHeader from "./ReferralDetailsHeader";
import { X } from "lucide-react";

export default function ReferralDetails({
  referral,
  onClose,
}: ReferralDetailsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "candidates">("overview");

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            relative
            w-full
            max-w-4xl
            max-h-[90vh]
            overflow-y-auto
            rounded-xl
            border
            border-[#1e293b]
            bg-[#111827]
            shadow-2xl
            p-5
          "
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <ReferralDetailsHeader referral={referral} />

          {/* Tabs */}
          <div className="flex rounded-lg bg-[#1e293b] p-1 w-fit mb-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab("candidates")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                activeTab === "candidates"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Candidates
            </button>
          </div>

          {/* Content */}
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