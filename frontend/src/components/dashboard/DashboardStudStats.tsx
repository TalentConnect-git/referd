import { DashboardStudStatsProps } from "@/types/dashboard";

export default function DashboardStudStats({applicationsSent, interviewCalls, resumeScore, hiringScore }: DashboardStudStatsProps) 
{
    return (
   
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 px-3">
     <div className="rounded-xl border border-gray-800 bg-[#0f172a] p-4">
        <h3 className="text-sm text-gray-400 uppercase">Applications Sent</h3>
        <p className="mt-4 text-2xl font-bold text-white">{applicationsSent}</p>
      </div>

      <div className="rounded-xl border border-gray-800 bg-[#0f172a] p-4">
        <h3 className="text-sm text-gray-400 uppercase">Interview Calls</h3>
        <p className="mt-4 text-2xl font-bold text-white">{interviewCalls}</p>
      </div>

      <div className="rounded-xl border border-gray-800 bg-[#0f172a] p-4">
        <h3 className="text-sm text-gray-400 uppercase">Resume Score</h3>
        <p className="mt-4 text-2xl font-bold text-white">{resumeScore}</p>
      </div>

      <div className="rounded-xl border border-gray-800 bg-[#0f172a] p-4">
        <h3 className="text-sm text-gray-400 uppercase">Hiring Score</h3>
        <p className="mt-4 text-2xl font-bold text-white">{hiringScore}</p>
      </div>

    </div>

  );
}