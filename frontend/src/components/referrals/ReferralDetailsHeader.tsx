import { ReferralJob, ReferralDetailsHeaderProps } from "@/types/referral";

export default function ReferralDetailsHeader({
  referral,
}: ReferralDetailsHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-[#1e293b] pb-3 mb-3">
      <div className="min-w-0">
        <h1 className="text-base font-bold text-white truncate">
          {referral.jobTitle?.[0] || "Untitled Job"}
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {referral.location?.[0] || "Location not specified"}
        </p>
      </div>

      <span
        className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${
          referral.jobStatus === "Active"
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
        }`}
      >
        {referral.jobStatus || "N/A"}
      </span>
    </div>
  );
}