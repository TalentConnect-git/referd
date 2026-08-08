// app/career-insights/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import {
  ArrowLeft,
  Award,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileText,
  GraduationCap,
  Lightbulb,
  Loader2,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import type { CareerInsightsData } from "@/types/career-insights";
import ProgressBar from "@/components/career/ProgressBar";
import SkillCategoryCard from "@/components/career/SkillCategoryCard";

export default function CareerInsightsPage() {
  const router = useRouter();
  const { profile, profileLoading } = useAuth();
  const [insights, setInsights] = useState<CareerInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCareerInsights();
  }, []);

  const fetchCareerInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/api/career-insights`);

      if (response.data.success) {
        setInsights(response.data.data);
      } else {
        setError("Failed to load career insights");
      }
    } catch (err) {
      console.error("Error fetching career insights:", err);
      setError("Unable to load career insights. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--text-primary)]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--primary)]" />
        <span className="text-sm text-[var(--text-muted)]">
          Loading career insights...
        </span>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--text-primary)]">
        <div className="max-w-md text-center">
          <CircleAlert className="mx-auto mb-4 h-12 w-12 text-[var(--danger)]" />
          <p className="text-sm text-[var(--text-muted)]">
            {error || "No insights available"}
          </p>
          <button
            onClick={() => router.back()}
            className="btn-primary mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const {
    categorizedSkills,
    hiringBreakdown,
    hiringInsights,
    hiringScore,
    missingSkills,
    resumeScore,
    suggestions,
    lastAnalyzedAt,
  } = insights;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--background-soft)] px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() => router.back()}
            className="group mb-3 inline-flex items-center gap-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Career Insights
              </h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Last analyzed:{" "}
                {new Date(lastAnalyzedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-[var(--primary-border)] bg-[var(--primary-soft)] px-3 py-1.5">
                <Zap className="h-4 w-4 text-[var(--primary)]" />
                <span className="text-sm font-semibold text-[var(--primary)]">
                  Score: {hiringScore}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        {/* Profile Progress Section */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-xs text-[var(--text-muted)]">Profile</span>
            </div>
            <ProgressBar
              label="Profile Completeness"
              value={hiringBreakdown.profileScore}
              color="green"
              size="lg"
            />
          </div>
          <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[var(--danger)]" />
              <span className="text-xs text-[var(--text-muted)]">Resume</span>
            </div>
            <ProgressBar
              label="Resume Quality"
              value={resumeScore}
              color="red"
              size="lg"
            />
          </div>
          <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[var(--warning)]" />
              <span className="text-xs text-[var(--text-muted)]">Projects</span>
            </div>
            <ProgressBar
              label="Project Impact"
              value={hiringBreakdown.applicationQualityScore}
              color="yellow"
              size="lg"
            />
          </div>
          <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-[var(--info)]" />
              <span className="text-xs text-[var(--text-muted)]">
                Referrals
              </span>
            </div>
            <ProgressBar
              label="Referral Network"
              value={hiringBreakdown.activityScore}
              color="blue"
              size="lg"
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Skill Market Demand */}
            <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--primary)]" />
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Skill Market Demand
                </h2>
              </div>
              <div className="space-y-3">
                <SkillCategoryCard
                  title="High in Demand"
                  skills={categorizedSkills.highInDemand}
                  icon="high"
                  color="var(--success)"
                />
                <SkillCategoryCard
                  title="Growing"
                  skills={categorizedSkills.growing}
                  icon="growing"
                  color="var(--warning)"
                />
                <SkillCategoryCard
                  title="Saturated"
                  skills={categorizedSkills.saturated}
                  icon="saturated"
                  color="var(--warning)"
                />
                <SkillCategoryCard
                  title="Obsolete"
                  skills={categorizedSkills.obsolete}
                  icon="obsolete"
                  color="var(--danger)"
                />
              </div>
            </div>

            {/* Missing Skills */}
            {missingSkills.length > 0 && (
              <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <CircleAlert className="h-5 w-5 text-[var(--warning)]" />
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    Skills to Acquire
                  </h2>
                  <span className="badge badge-warning ml-auto rounded-full px-2 py-0.5 text-xs">
                    {missingSkills.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="badge badge-warning rounded-full border border-[var(--warning-border)] bg-[var(--warning-soft)] px-3 py-1 text-sm text-[var(--warning)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Hiring Insights */}
            {hiringInsights.length > 0 && (
              <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-[var(--primary)]" />
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    Hiring Insights
                  </h2>
                </div>
                <div className="space-y-2">
                  {hiringInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg bg-[var(--background-soft)] p-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--success)]" />
                      <p className="text-sm text-[var(--text-secondary)]">
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    AI Suggestions
                  </h2>
                </div>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-[var(--primary-border)] bg-[var(--background-soft)] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-bold text-[var(--primary)]">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-6 text-[var(--text-secondary)]">
                          {suggestion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            {/* Overall Score Card */}
            <div className="surface-card rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-[var(--primary-soft)] p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[var(--primary-border)] bg-[var(--primary-soft)]">
                    <span className="text-4xl font-bold text-[var(--primary)]">
                      {hiringScore}
                    </span>
                  </div>
                </div>
                <h3 className="mt-3 text-base font-semibold text-[var(--text-primary)]">
                  Overall Hiring Score
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Based on your profile strength
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-sm text-[var(--text-muted)]">
                    Profile Score
                  </span>
                  <span className="text-sm font-semibold text-[var(--success)]">
                    {hiringBreakdown.profileScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-sm text-[var(--text-muted)]">
                    Resume Score
                  </span>
                  <span className="text-sm font-semibold text-[var(--danger)]">
                    {resumeScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-sm text-[var(--text-muted)]">
                    Application Quality
                  </span>
                  <span className="text-sm font-semibold text-[var(--warning)]">
                    {hiringBreakdown.applicationQualityScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">
                    Activity
                  </span>
                  <span className="text-sm font-semibold text-[var(--info)]">
                    {hiringBreakdown.activityScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Skill Count */}
            <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
                Skill Overview
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">
                    High in Demand
                  </span>
                  <span className="text-sm font-semibold text-[var(--success)]">
                    {categorizedSkills.highInDemand.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">
                    Growing
                  </span>
                  <span className="text-sm font-semibold text-[var(--warning)]">
                    {categorizedSkills.growing.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">
                    Saturated
                  </span>
                  <span className="text-sm font-semibold text-[var(--warning)]">
                    {categorizedSkills.saturated.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">
                    Obsolete
                  </span>
                  <span className="text-sm font-semibold text-[var(--danger)]">
                    {categorizedSkills.obsolete.length}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    Total Skills
                  </span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {categorizedSkills.highInDemand.length +
                      categorizedSkills.growing.length +
                      categorizedSkills.saturated.length +
                      categorizedSkills.obsolete.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
