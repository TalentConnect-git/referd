import { ReferralDetailsOverviewProps } from "@/types/referral";

export default function ReferralDetailsOverview({
  referral,
}: ReferralDetailsOverviewProps) {
  return (
    <div className="space-y-3">
      {/* About Role */}
      <div className="card rounded-lg border border-theme bg-card p-3">
        <h2 className="mb-1 text-sm font-semibold text-primary">About the Role</h2>
        <p className="text-sm text-secondary leading-relaxed">
          {referral.description || "No description available"}
        </p>
      </div>

      {/* Requirements */}
      <div className="card rounded-lg border border-theme bg-card p-3">
        <h2 className="mb-1.5 text-sm font-semibold text-primary">Requirements</h2>
        {referral.skills?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {referral.skills.map((skill) => (
              <span
                key={skill}
                className="badge badge-info rounded-full border border-info/30 px-2.5 py-0.5 text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No requirements specified</p>
        )}
      </div>

      {/* Eligibility */}
      <div className="card rounded-lg border border-theme bg-card p-3">
        <h2 className="mb-1 text-sm font-semibold text-primary">Eligibility</h2>
        <p className="text-sm text-secondary">
          {referral.eligibilityCriteria || "Not specified"}
        </p>
      </div>

      {/* Benefits */}
      <div className="card rounded-lg border border-theme bg-card p-3">
        <h2 className="mb-1.5 text-sm font-semibold text-primary">Benefits</h2>
        {referral.benefits?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {referral.benefits.map((benefit) => (
              <span
                key={benefit}
                className="badge badge-success rounded-full border border-success/30 px-2.5 py-0.5 text-xs"
              >
                {benefit}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No benefits specified</p>
        )}
      </div>

      {/* Certifications */}
      <div className="card rounded-lg border border-theme bg-card p-3">
        <h2 className="mb-1.5 text-sm font-semibold text-primary">Certifications</h2>
        {referral.certifications?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {referral.certifications.map((certification) => (
              <span
                key={certification}
                className="badge rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-300"
              >
                {certification}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No certifications specified</p>
        )}
      </div>

      {/* Job Information */}
      <div className="card rounded-lg border border-theme bg-card p-3">
        <h2 className="mb-2 text-sm font-semibold text-primary">Job Information</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <p className="text-muted">Experience</p>
          <p className="text-primary">{referral.yearsOfExperience || "N/A"}</p>

          <p className="text-muted">Min Education</p>
          <p className="text-primary">{referral.minEducation || "N/A"}</p>

          <p className="text-muted">Streams</p>
          <p className="text-primary text-xs">{referral.studentStreams?.join(", ") || "N/A"}</p>

          <p className="text-muted">Rounds</p>
          <p className="text-primary">{referral.rounds?.join(", ") || "N/A"}</p>

          <p className="text-muted">Selection Process</p>
          <p className="text-primary text-xs">{referral.selectionProcess?.join(", ") || "N/A"}</p>

          <p className="text-muted">Work Authorization</p>
          <p className="text-primary">{referral.workAuthorization || "N/A"}</p>

          <p className="text-muted">Openings</p>
          <p className="text-primary">{referral.numberOfOpenings ?? "N/A"}</p>

          <p className="text-muted">Status</p>
          <p className="text-primary">{referral.approvalStatus}</p>
        </div>
      </div>

      {/* Package Details */}
      <div className="card rounded-lg border border-theme bg-card p-3">
        <h2 className="mb-2 text-sm font-semibold text-primary">Package Details</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <p className="text-muted">Currency</p>
          <p className="text-primary">{referral.packageDetails?.currency || "N/A"}</p>

          <p className="text-muted">CTC</p>
          <p className="text-primary font-medium text-success">
            ₹ {referral.packageDetails?.totalCTC?.toLocaleString("en-IN") || "N/A"}
          </p>

          <p className="text-muted">Fixed Pay</p>
          <p className="text-primary">
            ₹ {referral.packageDetails?.fixedPay?.toLocaleString("en-IN") || "N/A"}
          </p>

          <p className="text-muted">Joining Bonus</p>
          <p className="text-primary">
            ₹ {referral.packageDetails?.joiningBonus?.toLocaleString("en-IN") || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}