"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getInterviewById, markInterviewAsRead } from "@/services/navbar.service";
import { Interview } from "@/types/navbar";
import {
  Calendar,
  Clock,
  Building2,
  Briefcase,
  Video,
  ArrowLeft,
  Loader2,
  MapPin,
  Users,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

export default function InterviewDetailPage() {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.id as string;
  const { profile, user } = useAuth();
  const userType = profile?.profileType || user?.userType || "student";
  
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await getInterviewById(interviewId);
        setInterview(res.data);
        
        // Mark interview as read when viewed
        await markInterviewAsRead(interviewId);
      } catch (err) {
        console.log("Error fetching interview:", err);
        setError("Failed to load interview details");
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [interviewId]);

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
        return <CalendarDays className="w-4 h-4 text-green-400" />;
      case "Completed":
        return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      case "Missed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <CalendarDays className="w-4 h-4 text-gray-400" />;
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
            <Loader2 className="w-10 h-10 animate-spin text-green-400" />
            <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-green-400/20 animate-ping" />
          </div>
          <p className="text-gray-400 text-sm">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Interview Not Found</h2>
          <p className="text-gray-400 text-sm mb-4">{error || "The interview you're looking for doesn't exist."}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isUpcoming = interview.status === "Scheduled";

  return (
    <div className="min-h-screen bg-[#0F172A] px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Interviews</span>
        </button>

        {/* Main Card */}
        <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">
                    {interview.jobId?.jobTitle || "Interview"}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      interview.status
                    )}`}
                  >
                    {getStatusIcon(interview.status)}
                    {interview.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-300">
                    {interview.companySnapshot?.companyName || "Company"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <Calendar className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-sm text-white font-medium">{formatDate(interview.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Time</p>
                  <p className="text-sm text-white font-medium">{interview.time}</p>
                </div>
              </div>
            </div>

            {/* Meeting Link */}
            {interview.meetLink && (
              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-400">Meeting Link</p>
                      <p className="text-sm text-green-400 font-medium truncate max-w-[200px] sm:max-w-md">
                        {interview.meetLink}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(interview.meetLink!)}
                      className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                      title="Copy link"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <a
                      href={interview.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400 text-sm font-medium"
                    >
                      Join Meeting
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            {interview.message && (
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Message from Recruiter</p>
                    <p className="text-sm text-gray-300">{interview.message}</p>
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