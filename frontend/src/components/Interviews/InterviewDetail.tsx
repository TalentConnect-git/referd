"use client";

import { Interview } from "@/types/navbar";
import {
  Calendar,
  Clock,
  Building2,
  Briefcase,
  Video,
  ArrowLeft,
  Loader2,
  Users,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface InterviewDetailProps {
  interview: Interview | null;
  loading: boolean;
  error: string | null;
  userType: string;
  onBack: () => void;
}

export default function InterviewDetail({
  interview,
  loading,
  error,
  userType,
  onBack,
}: InterviewDetailProps) {
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "Completed":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "Missed":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <CalendarDays className="w-3.5 h-3.5 text-green-400" />;
      case "Completed":
        return <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />;
      case "Missed":
        return <XCircle className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <CalendarDays className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Loader2 className="w-8 h-8 animate-spin text-green-400" />
            <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-green-400/20 animate-ping" />
          </div>
          <p className="text-gray-400 text-xs">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-1.5">Interview Not Found</h2>
          <p className="text-gray-400 text-xs mb-4">
            {error || "The interview you're looking for doesn't exist."}
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] px-3 py-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors mb-4 text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Interviews</span>
        </button>

        {/* Main Card */}
        <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h1 className="text-lg font-semibold text-white tracking-tight">
                    {interview.jobId?.jobTitle || "Interview"}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(
                      interview.status
                    )}`}
                  >
                    {getStatusIcon(interview.status)}
                    {interview.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs text-gray-300">
                    {interview.companySnapshot?.companyName || "Company"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 space-y-4">
            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <Calendar className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-[10px] text-gray-400">Date</p>
                  <p className="text-xs text-white font-medium">
                    {formatDate(interview.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <Clock className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-[10px] text-gray-400">Time</p>
                  <p className="text-xs text-white font-medium">{interview.time}</p>
                </div>
              </div>
            </div>

            {/* Interview Details */}
           

            {/* Meeting Link */}
            {interview.meetLink && (
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-[10px] text-gray-400">Meeting Link</p>
                      <p className="text-xs text-green-400 font-medium truncate max-w-[180px] sm:max-w-md">
                        {interview.meetLink}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <button
                      onClick={() => copyToClipboard(interview.meetLink!)}
                      className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors flex-1 sm:flex-none"
                      title="Copy link"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </button>
                    <a
                      href={interview.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400 text-xs font-medium flex-1 sm:flex-none"
                    >
                      Join Meeting
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            {interview.message && (
              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-400 mb-0.5">
                      Message from Recruiter
                    </p>
                    <p className="text-xs text-gray-300 leading-relaxed">{interview.message}</p>
                  </div>
                </div>
              </div>
            )}

            
            
          </div>
        </div>
      </div>
    </div>
  );
}