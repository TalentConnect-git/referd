// app/career-insights/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
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
  Zap
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

      const backendUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${backendUrl}/api/career-insights`,
        {
          withCredentials: true,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
        }
      );

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
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f16] text-white">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#38e878]" />
        <span className="text-[#94a3b8]">Loading career insights...</span>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f16] text-white">
        <div className="text-center max-w-md">
          <CircleAlert className="mx-auto h-12 w-12 text-[#e83838] mb-4" />
          <p className="text-[#94a3b8]">{error || "No insights available"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#38e878] px-4 py-2 text-[#0a0f16] font-semibold hover:bg-[#4af088] transition-colors"
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
    lastAnalyzedAt
  } = insights;

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white">
      {/* Header */}
      <div className="border-b border-[#1a2533] bg-[#0d1520] px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() => router.back()}
            className="mb-3 inline-flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Career Insights</h1>
              <p className="mt-1 text-[13px] text-[#94a3b8]">
                Last analyzed: {new Date(lastAnalyzedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-[#12381f] px-3 py-1.5">
                <Zap className="h-4 w-4 text-[#38e878]" />
                <span className="text-[13px] font-semibold text-[#38e878]">
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
          <div className="rounded-xl border border-[#1a2533] bg-[#0d1520] p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-[#38e878]" />
              <span className="text-[12px] text-[#64748b]">Profile</span>
            </div>
            <ProgressBar
              label="Profile Completeness"
              value={hiringBreakdown.profileScore}
              color="green"
              size="lg"
            />
          </div>
          <div className="rounded-xl border border-[#1a2533] bg-[#0d1520] p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-[#e83838]" />
              <span className="text-[12px] text-[#64748b]">Resume</span>
            </div>
            <ProgressBar
              label="Resume Quality"
              value={resumeScore}
              color="red"
              size="lg"
            />
          </div>
          <div className="rounded-xl border border-[#1a2533] bg-[#0d1520] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-[#e8d838]" />
              <span className="text-[12px] text-[#64748b]">Projects</span>
            </div>
            <ProgressBar
              label="Project Impact"
              value={hiringBreakdown.applicationQualityScore}
              color="yellow"
              size="lg"
            />
          </div>
          <div className="rounded-xl border border-[#1a2533] bg-[#0d1520] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-[#3898e8]" />
              <span className="text-[12px] text-[#64748b]">Referrals</span>
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
            <div className="rounded-xl border border-[#1a2533] bg-[#0d1520] p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-[#38e878]" />
                <h2 className="text-[17px] font-bold text-white">Skill Market Demand</h2>
              </div>
              <div className="space-y-3">
                <SkillCategoryCard
                  title="High in Demand"
                  skills={categorizedSkills.highInDemand}
                  icon="high"
                  color="#38e878"
                />
                <SkillCategoryCard
                  title="Growing"
                  skills={categorizedSkills.growing}
                  icon="growing"
                  color="#e8d838"
                />
                <SkillCategoryCard
                  title="Saturated"
                  skills={categorizedSkills.saturated}
                  icon="saturated"
                  color="#e8a838"
                />
                <SkillCategoryCard
                  title="Obsolete"
                  skills={categorizedSkills.obsolete}
                  icon="obsolete"
                  color="#e83838"
                />
              </div>
            </div>

            {/* Missing Skills */}
            {missingSkills.length > 0 && (
              <div className="rounded-xl border border-[#1a2533] bg-[#0d1520] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CircleAlert className="h-5 w-5 text-[#e8d838]" />
                  <h2 className="text-[17px] font-bold text-white">Skills to Acquire</h2>
                  <span className="ml-auto rounded-full bg-[#e8d838]/20 px-2 py-0.5 text-[12px] text-[#e8d838]">
                    {missingSkills.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-[#e8d838]/30 bg-[#e8d838]/10 px-3 py-1 text-[13px] text-[#e8d838]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Hiring Insights */}
            {hiringInsights.length > 0 && (
              <div className="rounded-xl border border-[#1a2533] bg-[#0d1520] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-[#38e878]" />
                  <h2 className="text-[17px] font-bold text-white">Hiring Insights</h2>
                </div>
                <div className="space-y-2">
                  {hiringInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg bg-[#0a0f16] p-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#38e878]" />
                      <p className="text-[13px] text-[#94a3b8]">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="rounded-xl border border-[#1a2533] bg-[#0d1520] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-[#38e878]" />
                  <h2 className="text-[17px] font-bold text-white">AI Suggestions</h2>
                </div>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-[#12381f]/40 bg-[#0a0f16] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#12381f] text-[12px] font-bold text-[#38e878]">
                          {index + 1}
                        </div>
                        <p className="text-[13px] leading-6 text-[#94a3b8]">
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
            <div className="rounded-xl border border-[#1a2533] bg-gradient-to-br from-[#0d1520] to-[#12381f]/20 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#38e878]/30 bg-[#12381f]/30">
                    <span className="text-4xl font-bold text-[#38e878]">
                      {hiringScore}
                    </span>
                  </div>
                </div>
                <h3 className="mt-3 text-[15px] font-semibold text-white">Overall Hiring Score</h3>
                <p className="text-[12px] text-[#64748b]">Based on your profile strength</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-xl border border-[#1a2533] bg-[#0d1520] p-6">
              <h3 className="mb-4 text-[15px] font-semibold text-white">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1a2533] pb-2">
                  <span className="text-[13px] text-[#94a3b8]">Profile Score</span>
                  <span className="text-[13px] font-semibold text-[#38e878]">
                    {hiringBreakdown.profileScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1a2533] pb-2">
                  <span className="text-[13px] text-[#94a3b8]">Resume Score</span>
                  <span className="text-[13px] font-semibold text-[#e83838]">
                    {resumeScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1a2533] pb-2">
                  <span className="text-[13px] text-[#94a3b8]">Application Quality</span>
                  <span className="text-[13px] font-semibold text-[#e8d838]">
                    {hiringBreakdown.applicationQualityScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#94a3b8]">Activity</span>
                  <span className="text-[13px] font-semibold text-[#3898e8]">
                    {hiringBreakdown.activityScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Skill Count */}
            <div className="rounded-xl border border-[#1a2533] bg-[#0d1520] p-6">
              <h3 className="mb-4 text-[15px] font-semibold text-white">Skill Overview</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#94a3b8]">High in Demand</span>
                  <span className="text-[13px] font-semibold text-[#38e878]">
                    {categorizedSkills.highInDemand.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#94a3b8]">Growing</span>
                  <span className="text-[13px] font-semibold text-[#e8d838]">
                    {categorizedSkills.growing.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#94a3b8]">Saturated</span>
                  <span className="text-[13px] font-semibold text-[#e8a838]">
                    {categorizedSkills.saturated.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#94a3b8]">Obsolete</span>
                  <span className="text-[13px] font-semibold text-[#e83838]">
                    {categorizedSkills.obsolete.length}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-[#1a2533] flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-white">Total Skills</span>
                  <span className="text-[13px] font-bold text-white">
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