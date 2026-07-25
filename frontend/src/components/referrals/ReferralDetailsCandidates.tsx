import { ReferralDetailsCandidatesProps, ReferralCandidate } from "@/types/referral";
import { getReferralCandidates } from "@/services/referral.service";
import { useState, useEffect } from "react";

export default function ReferralDetailsCandidates({ referral }: ReferralDetailsCandidatesProps) {
  const [candidates, setCandidates] = useState<ReferralCandidate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, [referral._id]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await getReferralCandidates(referral._id);
      setCandidates(response.data || []);
    } catch (error) {
      console.error("Error fetching candidates", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2 text-sm text-muted">Loading candidates...</span>
      </div>
    );
  }

  if (!candidates.length) {
    return (
      <div className="card rounded-lg border border-theme bg-card p-6 text-center">
        <p className="text-sm text-muted">No candidates found</p>
      </div>
    );
  }

  return (
    <div className="card rounded-lg border border-theme bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background-soft">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted uppercase tracking-wider">Name</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted uppercase tracking-wider">Email</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted uppercase tracking-wider">Phone</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted uppercase tracking-wider">Match Score</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-divider">
            {candidates.map((candidate) => (
              <tr key={candidate._id} className="hover:bg-card-hover transition-colors">
                <td className="px-4 py-2.5 text-primary font-medium">
                  {candidate.applicant.name || "N/A"}
                </td>
                <td className="px-4 py-2.5 text-secondary text-xs">
                  {candidate.applicant.email || "N/A"}
                </td>
                <td className="px-4 py-2.5 text-secondary text-xs">
                  {candidate.applicant.phone || "N/A"}
                </td>
                <td className="px-4 py-2.5">
                  <span className="badge badge-info inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-info/30">
                    {candidate.matchScore || 0}%
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-theme bg-background-soft text-secondary">
                    {candidate.currentStatus || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}