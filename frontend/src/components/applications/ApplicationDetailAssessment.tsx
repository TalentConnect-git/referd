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
        card
        rounded-2xl
        border
        border-theme
        bg-gradient-to-r from-card to-card-soft
        p-5
        shadow-xl
        shadow-black/20
        backdrop-blur-sm
      "
    >
      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <span className="bg-gradient-to-r from-primary to-primary-light w-1 h-6 rounded-full"></span>
        Candidate Assessment
      </h2>

      <div className="flex flex-row gap-3">
        {/* Rating - Available in data */}
        {application?.rating !== undefined && application?.rating !== null && (
          <div className="flex-1 rounded-xl bg-background border border-theme p-3.5 hover:border-warning/30 transition-colors">
            <p className="text-xs text-muted font-medium">Rating</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xl font-bold text-warning">
                {rating}
                <span className="text-xs text-muted font-normal">/5</span>
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-sm ${
                    star <= Math.round(rating) 
                      ? 'text-warning' 
                      : 'text-muted'
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
          <div className="flex-1 rounded-xl bg-background border border-theme p-3.5 hover:border-info/30 transition-colors">
            <p className="text-xs text-muted font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-info"></span>
              Admin Comment
            </p>
            <p className="text-sm text-secondary mt-1.5 leading-relaxed">
              {application.adminComment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}