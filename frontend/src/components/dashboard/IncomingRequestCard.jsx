"use client";

import React from "react";

const IncomingRequestCard = ({ application, formatDate }) => {
  const {
    applicantName,
    jobTitle,
    applicantEmail,
    applicantPhone,
    academicBackground,
    skills,
    matchScore,
    createdAt,
    currentStatus,
  } = application || {};

  console.log("application",application);

  const getStatusColor = (status) => {
    const statusMap = {
      pending: "bg-yellow-500/20 text-yellow-400",
      reviewed: "bg-blue-500/20 text-blue-400",
      accepted: "bg-green-500/20 text-green-400",
      approved: "bg-green-500/20 text-green-400",
      waitlist: "bg-purple-500/20 text-purple-400",
      rejected: "bg-red-500/20 text-red-400",
    };
    return statusMap[status?.toLowerCase()] || "bg-gray-500/20 text-gray-400";
  };

  // Using switch case for match score colors - FIXED
  const getMatchScoreColor = (score) => {
    // Ensure score is a number
    const numericScore = Number(score) || 0;
    
    switch (true) {
      case numericScore >= 75:
        return "text-green-400";
      case numericScore >= 40:
        return "text-orange-400";
      default:
        return "text-red-400";
    }
  };

  const getMatchScoreBg = (score) => {
    const numericScore = Number(score) || 0;
    
    switch (true) {
      case numericScore >= 75:
        return "bg-green-500";
      case numericScore >= 40:
        return "bg-orange-500";
      default:
        return "bg-red-500";
    }
  };

  const getMatchScoreLabel = (score) => {
    const numericScore = Number(score) || 0;
    
    switch (true) {
      case numericScore >= 75:
        return "High Match";
      case numericScore >= 40:
        return "Medium Match";
      default:
        return "Low Match";
    }
  };

  // Get match score circle color for the progress indicator
  const getMatchScoreCircleColor = (score) => {
    const numericScore = Number(score) || 0;
    
    switch (true) {
      case numericScore >= 75:
        return "stroke-green-500";
      case numericScore >= 40:
        return "stroke-orange-500";
      default:
        return "stroke-red-500";
    }
  };

  // Format date to Indian timezone (IST - Indian Standard Time)
  const formatDateToIST = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      
      // Convert to Indian timezone (UTC +5:30)
      const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      return date.toLocaleString("en-IN", options);
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="px-6 py-4 hover:bg-[#111a2e] transition-colors duration-150 border-b border-[#1e293b] last:border-b-0">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Applicant */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <span className="text-blue-400 font-medium text-sm">
                {applicantName?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
          </div>
          <div>
            <p className="font-medium text-white">{applicantName || "N/A"}</p>
            <p className="text-xs text-[#64748b]">{applicantEmail || "N/A"}</p>
            {applicantPhone && (
              <p className="text-xs text-[#64748b]">{applicantPhone}</p>
            )}
          </div>
        </div>

        {/* Role */}
        <div>
          <p className="font-medium text-white">{jobTitle || "N/A"}</p>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}
          >
            {currentStatus || "Pending"}
          </span>
        </div>

        {/* College */}
        <div>
          <p className="font-medium text-white">
            {academicBackground?.collegeName || "N/A"}
          </p>
          <p className="text-xs text-[#64748b]">
            {academicBackground?.course || ""}
            {academicBackground?.graduationYear
              ? ` (${academicBackground.graduationYear})`
              : ""}
          </p>
        </div>

        {/* Applied - Indian Timezone */}
        <div>
          <p className="font-medium text-white">{formatDateToIST(createdAt)}</p>
          <p className="text-xs text-[#64748b]">Applied on (IST)</p>
        </div>

        {/* Match Score */}
        <div className="flex items-center justify-between md:justify-start">
          <div className="flex items-center space-x-2">
            {/* Score Number */}
            <div
              className={`text-2xl font-bold ${getMatchScoreColor(matchScore)}`}
            >
              {matchScore || 0}%
            </div>
            
            {/* Progress Bar */}
            <div className="w-16 h-2 bg-[#1e293b] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getMatchScoreBg(matchScore)}`}
                style={{ 
                  width: `${Math.min(Math.max(Number(matchScore) || 0, 0), 100)}%`,
                  transition: 'width 0.5s ease-in-out'
                }}
              />
            </div>
            
            {/* Score Label */}
            <span
              className={`text-xs font-medium ${getMatchScoreColor(matchScore)}`}
            >
              {getMatchScoreLabel(matchScore)}
            </span>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default IncomingRequestCard;