import { ReferralJob,ReferralDetailsHeaderProps } from "@/types/referral";

export default function ReferralDetailsHeader({
  referral,
}: ReferralDetailsHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold">
        {referral.jobTitle?.[0]}
      </h1>

      <p className="text-gray-400 mt-2 text-md">
        {referral.location?.[0]}
      </p>

      <div className="flex gap-3 mt-4">
        <span className={`px-3 py-1 rounded-full text-sm ${referral.jobStatus === "Active"? "bg-green-500/20 text-green-400": "bg-gray-500/20 text-gray-400"}`}>
            {referral.jobStatus}
        </span>

        <span className={`px-3 py-1 rounded-full text-sm ${referral.approvalStatus === "Approved"? "bg-green-500/20 text-green-400": "bg-yellow-500/20 text-yellow-400"}`} >
            {referral.approvalStatus}
        </span>
      </div>
    </div>
  );
}