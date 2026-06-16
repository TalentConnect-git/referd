import { ReferralJob,ReferralDetailsOverviewProps } from "@/types/referral";

export default function ReferralDetailsOverview({
  referral,
}: ReferralDetailsOverviewProps) {
  return (
    <div className="space-y-6">
      {/* About Role */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <h2 className="font-semibold text-lg mb-3">
          About the Role
        </h2>

        <p className="text-gray-300 text-md">
          {referral.description ||
            "No description available"}
        </p>
      </div>

      {/* Requirements */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <h2 className="font-semibold text-lg mb-3">
          Requirements
        </h2>

        {referral.jobRoles?.length ? (
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            {referral.jobRoles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-md">
            No requirements specified
          </p>
        )}
      </div>

      {/* Eligibility */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <h2 className="font-semibold text-lg mb-3">
          Eligibility
        </h2>

        <div className="grid grid-cols-2 gap-4 text-gray-300">
          <div>
            <span className="font-medium text-md">
              CGPA:
            </span>{" "}
            {referral.cgpa || "Not specified"}
          </div>

          <div>
            <span className="font-medium text-md ">
              Openings:
            </span>{" "}
            {referral.numberOfOpenings ||
              "Not specified"}
          </div>

          <div>
            <span className="font-medium text-md">
              Batch:
            </span>{" "}
            {referral.batchYear?.join(", ") ||
              "Not specified"}
          </div>

          <div>
            <span className="font-medium text-md ">
              Location:
            </span>{" "}
            {referral.location?.join(", ")}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <h2 className="font-semibold text-lg mb-3">
          Benefits
        </h2>

        {referral.benefits?.length ? (
          <ul className="list-disc ml-6 space-y-2 text-gray-300 text-md">
            {referral.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-md">
            No benefits specified
          </p>
        )}
      </div>
    </div>
  );
}