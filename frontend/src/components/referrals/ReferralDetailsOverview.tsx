import { ReferralDetailsOverviewProps } from "@/types/referral";

export default function ReferralDetailsOverview({
  referral,
}: ReferralDetailsOverviewProps) {
  return (
    <div className="space-y-6">
      {/* About Role */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <h2 className="mb-3 text-lg font-semibold">
          About the Role
        </h2>

        <p className="text-gray-300">
          {referral.description || "No description available"}
        </p>
      </div>

      {/* Requirements */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <h2 className="mb-3 text-lg font-semibold">
          Requirements
        </h2>

        {referral.skills?.length ? (
          <ul className="ml-6 list-disc space-y-2 text-gray-300">
            {referral.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">
            No requirements specified
          </p>
        )}
      </div>

      {/* Eligibility */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <h2 className="mb-3 text-lg font-semibold">
          Eligibility
        </h2>

        <p className="text-gray-300">
          {referral.eligibilityCriteria || "Not specified"}
        </p>
      </div>

      {/* Benefits */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <h2 className="mb-3 text-lg font-semibold">
          Benefits
        </h2>

        {referral.benefits?.length ? (
          <ul className="ml-6 list-disc space-y-2 text-gray-300">
            {referral.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">
            No benefits specified
          </p>
        )}
      </div>

      {/* Certifications */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <h2 className="mb-3 text-lg font-semibold">
          Certifications
        </h2>

        {referral.certifications?.length ? (
          <ul className="ml-6 list-disc space-y-2 text-gray-300">
            {referral.certifications.map((certification) => (
              <li key={certification}>{certification}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">
            No certifications specified
          </p>
        )}
      </div>

      {/* Job Information */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <h2 className="mb-4 text-lg font-semibold">
          Job Information
        </h2>

        <div className="grid grid-cols-2 gap-y-4">
          <p className="text-gray-400">Experience</p>
          <p>{referral.yearsOfExperience || "N/A"}</p>

          <p className="text-gray-400">Min Education</p>
          <p>{referral.minEducation || "N/A"}</p>

          <p className="text-gray-400">Streams</p>
          <p>{referral.studentStreams?.join(", ") || "N/A"}</p>

          <p className="text-gray-400">Rounds</p>
          <p>{referral.rounds?.join(", ") || "N/A"}</p>

          <p className="text-gray-400">Selection Process</p>
          <p>{referral.selectionProcess?.join(", ") || "N/A"}</p>

          <p className="text-gray-400">Work Authorization</p>
          <p>{referral.workAuthorization || "N/A"}</p>

          <p className="text-gray-400">Openings</p>
          <p>{referral.numberOfOpenings ?? "N/A"}</p>

          <p className="text-gray-400">Status</p>
          <p>{referral.approvalStatus}</p>
        </div>
      </div>

      {/* Package Details */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <h2 className="mb-4 text-lg font-semibold">
          Package Details
        </h2>

        <div className="grid grid-cols-2 gap-y-4">
          <p className="text-gray-400">Currency</p>
          <p>{referral.packageDetails?.currency || "N/A"}</p>

          <p className="text-gray-400">CTC</p>
          <p>
            {referral.packageDetails?.totalCTC?.toLocaleString("en-IN") ||
              "N/A"}
          </p>

          <p className="text-gray-400">Fixed Pay</p>
          <p>
            {referral.packageDetails?.fixedPay?.toLocaleString("en-IN") ||
              "N/A"}
          </p>

          <p className="text-gray-400">Joining Bonus</p>
          <p>
            {referral.packageDetails?.joiningBonus?.toLocaleString("en-IN") ||
              "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}