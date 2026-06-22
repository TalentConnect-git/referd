import { ReferralDetailsCandidatesProps,ReferralCandidate } from "@/types/referral";
import { getReferralCandidates } from "@/services/referral.service";
import {useState,useEffect} from 'react';
export default function ReferralDetailsCandidates({referral}: ReferralDetailsCandidatesProps)
{
    const [candidates, setCandidates] = useState<ReferralCandidate[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {fetchCandidates();}, [referral._id]);
    const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response =
        await getReferralCandidates(referral._id);
        setCandidates(response.data || []);
        // setCandidates(dummyCandidates);

    } catch (error) {
      console.error( "Error fetching candidates", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading candidates...
      </div>
    );

  }
    return (
        
    <div className="rounded-xl border border-[var(--border)] p-5">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Match Score</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
            </tr>
          </thead>
        

          <tbody>
            {candidates.map((candidate) => (
            <tr key={candidate._id} className="border-b border-[var(--border)]">
            <td className="p-3">
                {candidate.applicant.name}
            </td>
            <td className="p-3">
                {candidate.applicant.email}
            </td>
            <td className="p-3">
                {candidate.applicant.phone}
            </td>
            <td className="p-3">
                <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-400">
                {candidate.matchScore}%
                </span>
            </td>
            <td className="p-3">
            <span className="px-2 py-1 rounded-md text-gray-300">
            {candidate.currentStatus}
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