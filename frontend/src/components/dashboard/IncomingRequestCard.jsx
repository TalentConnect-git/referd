// components/professional/IncomingRequestCard.jsx
"use client";

import React from 'react';
import { format } from 'date-fns';

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
    currentStatus
  } = application || {};

  const getStatusColor = (status) => {
    const statusMap = {
      'pending': 'bg-yellow-500/20 text-yellow-400',
      'reviewed': 'bg-blue-500/20 text-blue-400',
      'accepted': 'bg-green-500/20 text-green-400',
      'approved': 'bg-green-500/20 text-green-400',
      'rejected': 'bg-red-500/20 text-red-400',
    };
    return statusMap[status?.toLowerCase()] || 'bg-gray-500/20 text-gray-400';
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMatchScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="px-6 py-4 hover:bg-[#111a2e] transition-colors duration-150 border-b border-[#1e293b] last:border-b-0">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Applicant */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <span className="text-blue-400 font-medium text-sm">
                {applicantName?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
          <div>
            <p className="font-medium text-white">{applicantName || 'N/A'}</p>
            <p className="text-xs text-[#64748b]">{applicantEmail || 'N/A'}</p>
          </div>
        </div>

        {/* Role */}
        <div>
          <p className="font-medium text-white">{jobTitle || 'N/A'}</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}>
            {currentStatus || 'Pending'}
          </span>
        </div>

        {/* College */}
        <div>
          <p className="font-medium text-white">
            {academicBackground?.collegeName || 'N/A'}
          </p>
          <p className="text-xs text-[#64748b]">
            {academicBackground?.course || ''} 
            {academicBackground?.graduationYear ? ` (${academicBackground.graduationYear})` : ''}
          </p>
        </div>

        {/* Applied */}
        <div>
          <p className="font-medium text-white">
            {createdAt ? format(new Date(createdAt), 'MMM dd, yyyy') : 'N/A'}
          </p>
          <p className="text-xs text-[#64748b]">Applied on</p>
        </div>

        {/* Match Score */}
        <div className="flex items-center justify-between md:justify-start">
          <div className="flex items-center space-x-2">
            <div className={`text-2xl font-bold ${getMatchScoreColor(matchScore)}`}>
              {matchScore || 0}%
            </div>
            <div className="w-16 h-2 bg-[#1e293b] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getMatchScoreBg(matchScore)}`}
                style={{ width: `${Math.min(matchScore || 0, 100)}%` }}
              />
            </div>
          </div>
          
          {/* Action button */}
          <button className="ml-4 text-[#31aa40] hover:text-[#16a34a] text-sm font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>

      {/* Skills (optional) - show on larger screens or expandable */}
      {skills && skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-[#0d1324] text-[#909ca9]">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-xs text-[#64748b]">+{skills.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  );
};

export default IncomingRequestCard;