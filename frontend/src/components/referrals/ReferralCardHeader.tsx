import {ReferralJob,ReferralCardHeaderProps} from '@/types/referral';

export default function ReferralCardHeader({
  referral,
}: ReferralCardHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-lg bg-[var(--card-hover)] flex items-center justify-center text-lg font-bold">
          {referral.jobTitle?.[0]?.charAt(0)}
        </div>

        <div>
          <h3 className="text-md font-semibold">
            {referral.jobTitle?.[0]}
          </h3>

          <p className="text-muted-foreground text-sm ">
            {referral.location?.[0]}
          </p>
        </div>
      </div>


<div className="flex gap-2">
  <span
    className={`rounded-full px-2.5 py-0.5 text-xs border ${
      referral.inactive
        ? "border-gray-600 text-gray-400 bg-gray-900/40"
        : "border-green-600 text-green-400 bg-green-900/20"
    }`}
  >
    {referral.inactive ? "Closed" : "Active"}
  </span>

  <span
    className={`rounded-full px-2.5 py-0.5 text-xs border ${
      referral.approvalStatus === "Approved"
        ? "border-green-600 text-green-400 bg-green-900/20"
        : "border-yellow-600 text-yellow-400 bg-yellow-900/40"
    }`}
  >
    {referral.approvalStatus}
  </span>
</div>
    </div>
  );
}