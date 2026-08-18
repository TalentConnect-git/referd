"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  CircleAlert,
  X,
  ArrowRight,
  Loader2,
  TrendingUp,
  Award,
  Lightbulb,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import type { CareerInsightsData } from "@/types/career-insights";

const POPUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = "career_insight_popup_last_shown";

export default function CareerInsightPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const { user,role, loading: authLoading, isAuthenticated } = useAuth();
  const [insights, setInsights] = useState<CareerInsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  

  const fetchCareerInsights = useCallback(async () => {
    if (isFetchingRef.current) {
      console.log("Career Insights request already running.");
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);

      const response = await axiosInstance.get("/api/career-insights");

      if (!response.data?.success) {
        console.log("Career Insights API returned success=false", response.data);
        return;
      }

      const data = response.data?.data;

      if (!data) {
        console.log("Career Insights API returned no data.");
        return;
      }

      setInsights(data);
      setShowPopup(true);
      console.log("Career Insight Popup opened.");
    } catch (error: any) {
      console.error(
        "Career Insights API Error:",
        error?.response?.data || error?.message || error
      );
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  const scheduleNextPopup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const lastShown = localStorage.getItem(STORAGE_KEY);

    if (!lastShown) {
      console.log("🕐 No previous popup timestamp found.");
      timerRef.current = setTimeout(() => {
        fetchCareerInsights();
      }, POPUP_INTERVAL);
      return;
    }

    const lastShownTime = Number(lastShown);

    if (Number.isNaN(lastShownTime)) {
      localStorage.removeItem(STORAGE_KEY);
      timerRef.current = setTimeout(() => {
        fetchCareerInsights();
      }, POPUP_INTERVAL);
      return;
    }

    const elapsedTime = Date.now() - lastShownTime;

    if (elapsedTime >= POPUP_INTERVAL) {
      console.log("⏰ Popup interval completed.");
      fetchCareerInsights();
      return;
    }

    const remainingTime = POPUP_INTERVAL - elapsedTime;
    console.log(`⏳ Career popup in ${Math.ceil(remainingTime / 1000)} seconds`);

    timerRef.current = setTimeout(() => {
      fetchCareerInsights();
    }, remainingTime);
  }, [fetchCareerInsights]);

  useEffect(() => {
    if (authLoading) {
      console.log("⏳ Auth still loading...");
      return;
    }

    if (!isAuthenticated || !user) {
      console.log("👤 User is not logged in → Career popup disabled");
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    console.log("✅ Logged-in user detected:", user._id);
    scheduleNextPopup();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [authLoading, isAuthenticated, user, scheduleNextPopup]);

  const closePopup = () => {
    console.log("Career Insight Popup closed.");
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setShowPopup(false);
    scheduleNextPopup();
  };

  const openCareerInsights = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setShowPopup(false);
    window.location.href = `/${role}/career-insights`;
  };

  if (!showPopup || !insights) {
    return null;
  }

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
        style={{
          background: 'var(--overlay)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        {/* Modal */}
        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl animate-scale-in">
          {/* Close Button */}
          <button
            type="button"
            onClick={closePopup}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--background-soft)] text-[var(--text-secondary)] transition-all hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] hover:scale-110"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="border-b border-[var(--border)] bg-gradient-to-br from-[var(--primary-soft)] to-transparent p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1 pr-8">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Career Insights
                </h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Key areas to focus on for your career growth
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto p-6 space-y-5">
            {/* Important Insights */}
            {insights.hiringInsights?.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                  <TrendingUp className="h-4 w-4 text-[var(--primary)]" />
                  Important Things
                </h3>

                <div className="space-y-2">
                  {insights.hiringInsights.slice(0, 3).map((insight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-xl bg-[var(--background-soft)] p-3 border border-[var(--border)] transition-all hover:border-[var(--primary-border)] hover:shadow-sm"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
                      <p className="text-sm leading-5 text-[var(--text-secondary)]">
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {insights.missingSkills?.length > 0 && (
              <div className="rounded-xl border border-[var(--warning-border)] bg-[var(--warning-soft)] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CircleAlert className="h-4 w-4 text-[var(--warning)]" />
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Skills You Should Focus On
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {insights.missingSkills.slice(0, 5).map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {insights.suggestions?.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                  <Lightbulb className="h-4 w-4 text-[var(--primary)]" />
                  Suggestions
                </h3>

                <div className="space-y-2">
                  {insights.suggestions.slice(0, 3).map((suggestion, index) => (
                    <div
                      key={index}
                      className="rounded-xl bg-[var(--background-soft)] p-3 border border-[var(--border)] transition-all hover:border-[var(--primary-border)] hover:shadow-sm"
                    >
                      <p className="text-sm leading-5 text-[var(--text-secondary)]">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hiring Score */}
            {insights.hiringScore !== undefined &&
              insights.hiringScore !== null && (
                <div className="flex items-center justify-between rounded-xl border border-[var(--primary-border)] bg-[var(--primary-soft)] p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[var(--primary)] p-2">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Your Hiring Score
                      </p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        Keep improving your profile
                      </p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-[var(--primary)]">
                    {insights.hiringScore}
                  </span>
                </div>
              )}
          </div>

          {/* Footer */}
          <div className="border-t border-[var(--border)] bg-[var(--background-soft)] p-5">
            <button
              type="button"
              onClick={openCareerInsights}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--primary-hover)] hover:shadow-md active:scale-[0.98]"
            >
              <span>View Detailed Insights</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}