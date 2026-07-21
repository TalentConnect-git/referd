"use client";

import { ApplicationDetailAssessmentProps } from "@/types/applications";

export default function ApplicationDetailAssessment({
  application,
  applicant,
}: ApplicationDetailAssessmentProps) {
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

      <div className="flex flex-row gap-3">
        {/* Rating - Available in data */}
        {application?.rating !== undefined && application?.rating !== null && (
          <div className="flex-1 rounded-xl bg-[#0f172a] border border-[#2a3a52] p-3.5 hover:border-yellow-500/30 transition-colors">
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
          <div className="flex-1 rounded-xl bg-[#0f172a] border border-[#2a3a52] p-3.5 hover:border-blue-500/30 transition-colors">
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