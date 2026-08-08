"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  CircleAlert,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import type { CareerInsightsData } from "@/types/career-insights";

const POPUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = "career_insight_popup_last_shown";

export default function CareerInsightPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const { user, loading: authLoading, isAuthenticated } = useAuth();
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
    window.location.href = "/role/career-insight";
  };

  if (!showPopup || !insights) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-overlay p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-lg animate-scale-in">
        {/* Header */}
        <div className="border-b border-border p-5">
          <button
            type="button"
            onClick={closePopup}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-background-soft hover:text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-primary">
                Important Career Insights
              </h2>
              <p className="mt-1 text-sm text-muted">
                A few things you should focus on to improve your career profile.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[65vh] overflow-y-auto p-5">
          {/* Important Insights */}
          {insights.hiringInsights?.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-3 text-sm font-semibold text-primary">
                Important Things
              </h3>

              <div className="space-y-2">
                {insights.hiringInsights.slice(0, 3).map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl bg-background-soft p-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <p className="text-sm leading-5 text-secondary">
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {insights.missingSkills?.length > 0 && (
            <div className="mb-5 rounded-xl border border-warning-border bg-warning-soft p-4">
              <div className="mb-3 flex items-center gap-2">
                <CircleAlert className="h-4 w-4 text-warning" />
                <h3 className="text-sm font-semibold text-primary">
                  Skills You Should Focus On
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {insights.missingSkills.slice(0, 5).map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-card px-3 py-1.5 text-xs font-medium text-secondary border border-border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {insights.suggestions?.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-3 text-sm font-semibold text-primary">
                Suggestions
              </h3>

              <div className="space-y-2">
                {insights.suggestions.slice(0, 3).map((suggestion, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-background-soft p-3 border border-border"
                  >
                    <p className="text-sm leading-5 text-secondary">
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
              <div className="flex items-center justify-between rounded-xl border border-primary-border bg-primary-soft p-4">
                <div>
                  <p className="text-xs text-muted">Your Hiring Score</p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    Keep improving your profile
                  </p>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {insights.hiringScore}
                </span>
              </div>
            )}
        </div>

        
        <div className="border-t border-border p-5">
          <button
            type="button"
            onClick={openCareerInsights}
            className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            View Detail Insights
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}