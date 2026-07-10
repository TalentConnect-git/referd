import { ReferralDetailsOverviewProps } from "@/types/referral";

export default function ReferralDetailsOverview({
  referral,
}: ReferralDetailsOverviewProps) {
  return (
    <div className="space-y-3">
      {/* About Role */}
      <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-3">
        <h2 className="mb-1 text-sm font-semibold text-white">About the Role</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          {referral.description || "No description available"}
        </p>
      </div>

      {/* Requirements */}
      <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-3">
        <h2 className="mb-1.5 text-sm font-semibold text-white">Requirements</h2>
        {referral.skills?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {referral.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs text-blue-300"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No requirements specified</p>
        )}
      </div>

      {/* Eligibility */}
      <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-3">
        <h2 className="mb-1 text-sm font-semibold text-white">Eligibility</h2>
        <p className="text-sm text-gray-300">
          {referral.eligibilityCriteria || "Not specified"}
        </p>
      </div>

      {/* Benefits */}
      <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-3">
        <h2 className="mb-1.5 text-sm font-semibold text-white">Benefits</h2>
        {referral.benefits?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {referral.benefits.map((benefit) => (
              <span
                key={benefit}
                className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs text-green-300"
              >
                {benefit}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No benefits specified</p>
        )}
      </div>

      {/* Certifications */}
      <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-3">
        <h2 className="mb-1.5 text-sm font-semibold text-white">Certifications</h2>
        {referral.certifications?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {referral.certifications.map((certification) => (
              <span
                key={certification}
                className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-300"
              >
                {certification}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No certifications specified</p>
        )}
      </div>

      {/* Job Information */}
      <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-3">
        <h2 className="mb-2 text-sm font-semibold text-white">Job Information</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <p className="text-gray-400">Experience</p>
          <p className="text-white">{referral.yearsOfExperience || "N/A"}</p>

          <p className="text-gray-400">Min Education</p>
          <p className="text-white">{referral.minEducation || "N/A"}</p>

          <p className="text-gray-400">Streams</p>
          <p className="text-white text-xs">{referral.studentStreams?.join(", ") || "N/A"}</p>

          <p className="text-gray-400">Rounds</p>
          <p className="text-white">{referral.rounds?.join(", ") || "N/A"}</p>

          <p className="text-gray-400">Selection Process</p>
          <p className="text-white text-xs">{referral.selectionProcess?.join(", ") || "N/A"}</p>

          <p className="text-gray-400">Work Authorization</p>
          <p className="text-white">{referral.workAuthorization || "N/A"}</p>

          <p className="text-gray-400">Openings</p>
          <p className="text-white">{referral.numberOfOpenings ?? "N/A"}</p>

          <p className="text-gray-400">Status</p>
          <p className="text-white">{referral.approvalStatus}</p>
        </div>
      </div>

      {/* Package Details */}
      <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-3">
        <h2 className="mb-2 text-sm font-semibold text-white">Package Details</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <p className="text-gray-400">Currency</p>
          <p className="text-white">{referral.packageDetails?.currency || "N/A"}</p>

          <p className="text-gray-400">CTC</p>
          <p className="text-white font-medium text-green-400">
            ₹ {referral.packageDetails?.totalCTC?.toLocaleString("en-IN") || "N/A"}
          </p>

          <p className="text-gray-400">Fixed Pay</p>
          <p className="text-white">
            ₹ {referral.packageDetails?.fixedPay?.toLocaleString("en-IN") || "N/A"}
          </p>

          <p className="text-gray-400">Joining Bonus</p>
          <p className="text-white">
            ₹ {referral.packageDetails?.joiningBonus?.toLocaleString("en-IN") || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}