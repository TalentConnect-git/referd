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
        return "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]";
      case "Completed":
        return "text-[var(--info)] border-[var(--info-border)] bg-[var(--info-soft)]";
      case "Missed":
        return "text-[var(--danger)] border-[var(--danger-border)] bg-[var(--danger-soft)]";
      default:
        return "text-[var(--text-muted)] border-[var(--border)] bg-[var(--background-soft)]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <CalendarDays className="h-4 w-4 text-[var(--success)]" />;
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-[var(--info)]" />;
      case "Missed":
        return <XCircle className="h-4 w-4 text-[var(--danger)]" />;
      default:
        return <CalendarDays className="h-4 w-4 text-[var(--text-muted)]" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--primary)]" />
            <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full border-2 border-[var(--primary)]/20" />
          </div>
          <p className="text-sm text-[var(--text-muted)]">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--danger-soft)]">
            <XCircle className="h-10 w-10 text-[var(--danger)]" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">Interview Not Found</h2>
          <p className="mb-4 text-sm text-[var(--text-muted)]">{error || "The interview you're looking for doesn't exist."}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary-soft)] px-4 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary-soft)]/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isUpcoming = interview.status === "Scheduled";

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group mb-6 flex items-center gap-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="text-sm">Back to Interviews</span>
        </button>

        {/* Main Card */}
        <div className="surface-card overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          {/* Header */}
          <div className="border-b border-[var(--border)] p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    {interview.jobId?.jobTitle || "Interview"}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
                      interview.status
                    )}`}
                  >
                    {getStatusIcon(interview.status)}
                    {interview.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[var(--text-muted)]" />
                  <p className="text-sm text-[var(--text-secondary)]">
                    {interview.companySnapshot?.companyName || "Company"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6 p-6">
            {/* Date & Time */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background-soft)] p-3">
                <Calendar className="h-5 w-5 text-[var(--success)]" />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Date</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{formatDate(interview.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background-soft)] p-3">
                <Clock className="h-5 w-5 text-[var(--info)]" />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Time</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{interview.time}</p>
                </div>
              </div>
            </div>

            {/* Meeting Link */}
            {interview.meetLink && (
              <div className="rounded-lg border border-[var(--success-border)] bg-[var(--success-soft)] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-[var(--success)]" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Meeting Link</p>
                      <p className="max-w-[200px] truncate text-sm font-medium text-[var(--success)] sm:max-w-md">
                        {interview.meetLink}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(interview.meetLink!)}
                      className="rounded-lg bg-[var(--background-soft)] p-2 transition-colors hover:bg-[var(--card-hover)]"
                      title="Copy link"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-[var(--success)]" />
                      ) : (
                        <Copy className="h-4 w-4 text-[var(--text-muted)]" />
                      )}
                    </button>
                    <a
                      href={interview.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
                    >
                      Join Meeting
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            {interview.message && (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--background-soft)] p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-0.5 h-5 w-5 text-[var(--text-muted)]" />
                  <div>
                    <p className="mb-1 text-xs text-[var(--text-muted)]">Message from Recruiter</p>
                    <p className="text-sm text-[var(--text-secondary)]">{interview.message}</p>
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