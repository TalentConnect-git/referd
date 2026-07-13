import { ReferralJob, ReferralDetailsHeaderProps } from "@/types/referral";
import { MapPin } from "lucide-react";
import { useState } from "react";
import ReferralDetailsOverview from "./ReferralDetailsOverview";

export default function ReferralDetailsHeader({
  referral,
}: ReferralDetailsHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJobTitleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Get location display
  const getLocation = () => {
    if (referral.location?.[0]) return referral.location[0];
    
    return "Location not specified";
  };

  return (
    <>
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

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#2a3a52] bg-[#0f172a] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">
                {referral.jobTitle?.[0] || "Untitled Job"}
              </h2>
              <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                {getLocation()}
              </p>
            </div>

            {/* Modal Content - Overview */}
            <ReferralDetailsOverview referral={referral} />

            {/* Footer with Apply Button */}
            <div className="mt-6 pt-4 border-t border-[#2a3a52] flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}