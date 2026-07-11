"use client";

import { ApplicationDetailAssessmentProps } from "@/types/applications";

export default function ApplicationDetailAssessment({
  application,
  applicant,
}: ApplicationDetailAssessmentProps) {
  // Helper function to get match score color and label
  const getMatchScoreInfo = (score: number) => {
    if (score >= 75) {
      return { color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", label: "High", labelColor: "text-green-400" };
    } else if (score >= 40) {
      return { color: "text-orange-500", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", label: "Medium", labelColor: "text-orange-400" };
    } else {
      return { color: "text-red-500", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", label: "Low", labelColor: "text-red-400" };
    }
  };

  const matchScore = application?.matchScore ?? 0;
  const scoreInfo = getMatchScoreInfo(matchScore);

  // Safely get rating with fallback
  const rating = application?.rating ?? 0;

  return (
    <div
      className="
        rounded-2xl
        border
        border-[#2a3a52]
        bg-gradient-to-r from-[#111827] to-[#1a2332]
        p-5
        shadow-xl
        shadow-black/20
        backdrop-blur-sm
      "
    >
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="bg-gradient-to-r from-green-500 to-emerald-600 w-1 h-6 rounded-full"></span>
        Candidate Assessment
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Match Score - Always display */}
        <div className={`rounded-xl bg-[#0f172a] border ${scoreInfo.borderColor} p-3.5 hover:border-${scoreInfo.color.split('-')[1]}-500/50 transition-all hover:scale-[1.02]`}>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">Match Score</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreInfo.bgColor} ${scoreInfo.labelColor} border ${scoreInfo.borderColor}`}>
              {scoreInfo.label}
            </span>
          </div>
          <div className="flex items-end gap-3 mt-1">
            <p className={`text-2xl font-bold ${scoreInfo.color}`}>
              {matchScore}%
            </p>
            <div className="flex-1 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  matchScore >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  matchScore >= 40 ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                  'bg-gradient-to-r from-red-500 to-rose-500'
                }`}
                style={{ width: `${matchScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Current Status - Available in data */}
        {application?.currentStatus && (
          <div className="rounded-xl bg-[#0f172a] border border-[#2a3a52] p-3.5 hover:border-blue-500/30 transition-colors">
            <p className="text-xs text-slate-400 font-medium">Current Status</p>
            <p className="text-base font-semibold text-white mt-1">
              {application.currentStatus}
            </p>
          </div>
        )}

        {/* Rating - Available in data (5) */}
        {application?.rating !== undefined && application?.rating !== null && (
          <div className="rounded-xl bg-[#0f172a] border border-[#2a3a52] p-3.5 hover:border-yellow-500/30 transition-colors">
            <p className="text-xs text-slate-400 font-medium">Rating</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xl font-bold text-yellow-400">
                {rating}
                <span className="text-xs text-slate-400 font-normal">/5</span>
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-sm ${
                    star <= Math.round(rating) 
                      ? 'text-yellow-400' 
                      : 'text-slate-600'
                  }`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Admin Comment - Available in data */}
        {application?.adminComment && (
          <div className="rounded-xl bg-[#0f172a] border border-[#2a3a52] p-3.5 hover:border-blue-500/30 transition-colors md:col-span-2">
            <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Admin Comment
            </p>
            <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
              {application.adminComment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}