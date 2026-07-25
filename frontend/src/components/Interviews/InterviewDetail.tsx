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
        return "text-[var(--success)] bg-[var(--success-soft)] border-[var(--success-border)]";
      case "Completed":
        return "text-[var(--info)] bg-[var(--info-soft)] border-[var(--info-border)]";
      case "Missed":
        return "text-[var(--danger)] bg-[var(--danger-soft)] border-[var(--danger-border)]";
      default:
        return "text-[var(--text-muted)] bg-[var(--background-soft)] border-[var(--border)]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <CalendarDays className="h-3.5 w-3.5 text-[var(--success)]" />;
      case "Completed":
        return <CheckCircle2 className="h-3.5 w-3.5 text-[var(--info)]" />;
      case "Missed":
        return <XCircle className="h-3.5 w-3.5 text-[var(--danger)]" />;
      default:
        return <CalendarDays className="h-3.5 w-3.5 text-[var(--text-muted)]" />;
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
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
            <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full border-2 border-[var(--primary)]/20" />
          </div>
          <p className="text-xs text-[var(--text-muted)]">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--danger-soft)]">
            <XCircle className="h-8 w-8 text-[var(--danger)]" />
          </div>
          <h2 className="mb-1.5 text-lg font-semibold text-[var(--text-primary)]">Interview Not Found</h2>
          <p className="mb-4 text-xs text-[var(--text-muted)]">
            {error || "The interview you're looking for doesn't exist."}
          </p>
          <button
            onClick={onBack}
            className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-3 py-4">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="group mb-4 flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Interviews</span>
        </button>

        {/* Main Card */}
        <div className="surface-card overflow-hidden rounded-xl border border-[var(--border)]">
          {/* Header */}
          <div className="border-b border-[var(--border)] p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                    {interview.jobId?.jobTitle || "Interview"}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${getStatusColor(
                      interview.status
                    )}`}
                  >
                    {getStatusIcon(interview.status)}
                    {interview.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <p className="text-xs text-[var(--text-secondary)]">
                    {interview.companySnapshot?.companyName || "Company"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 p-4">
            {/* Date & Time */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--background-soft)] p-2.5">
                <Calendar className="h-4 w-4 text-[var(--success)]" />
                <div>
                  <p className="text-[10px] text-[var(--text-muted)]">Date</p>
                  <p className="text-xs font-medium text-[var(--text-primary)]">
                    {formatDate(interview.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--background-soft)] p-2.5">
                <Clock className="h-4 w-4 text-[var(--info)]" />
                <div>
                  <p className="text-[10px] text-[var(--text-muted)]">Time</p>
                  <p className="text-xs font-medium text-[var(--text-primary)]">{interview.time}</p>
                </div>
              </div>
            </div>

            {/* Meeting Link */}
            {interview.meetLink && (
              <div className="rounded-lg border border-[var(--success-border)] bg-[var(--success-soft)] p-3">
                <div className="flex flex-col items-start justify-between gap-2.5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2.5">
                    <Video className="h-4 w-4 text-[var(--success)]" />
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)]">Meeting Link</p>
                      <p className="max-w-[180px] truncate text-xs font-medium text-[var(--success)] sm:max-w-md">
                        {interview.meetLink}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-1.5 sm:w-auto">
                    <button
                      onClick={() => copyToClipboard(interview.meetLink!)}
                      className="flex-1 rounded-lg bg-[var(--background-soft)] p-1.5 transition-colors hover:bg-[var(--card-hover)] sm:flex-none"
                      title="Copy link"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-[var(--success)]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      )}
                    </button>
                    <a
                      href={interview.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium sm:flex-none"
                    >
                      Join Meeting
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            {interview.message && (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--background-soft)] p-3">
                <div className="flex items-start gap-2.5">
                  <MessageSquare className="mt-0.5 h-4 w-4 text-[var(--text-muted)]" />
                  <div>
                    <p className="mb-0.5 text-[10px] text-[var(--text-muted)]">
                      Message from Recruiter
                    </p>
                    <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{interview.message}</p>
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