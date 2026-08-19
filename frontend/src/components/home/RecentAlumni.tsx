"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  GraduationCap,
  MapPin,
  Clock,
  ArrowRight,
  UserPlus,
  Eye,
  TrendingUp,
  CheckCircle,
  Compass,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

interface AlumniData {
  _id: string;
  userId: string;
  name: string;
  profileImage?: string;
  currentCompany?: string;
  currentCompany_display?: string;
  educations?: Array<{
    college: string;
    college_display?: string;
    degree: string;
  }>;
  experiences?: Array<{
    company: string;
    company_display?: string;
    role: string;
    isCurrent: boolean;
  }>;
  jobRoles?: string[];
  locations?: string[];
  profileType?: string;
  createdAt: string;
  updatedAt: string;
}

export default function RecentAlumni() {
  const [alumni, setAlumni] = useState<AlumniData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const REFRESH_INTERVAL = 60000;
  const ALUMNI_COUNT = 6;

  useEffect(() => {
    fetchRecentAlumni();

    refreshIntervalRef.current = setInterval(() => {
      fetchRecentAlumni(true);
      setTimeRemaining(60);
    }, REFRESH_INTERVAL);

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  async function fetchRecentAlumni(isAutoRefresh = false) {
    try {
      // if (!isAutoRefresh) setLoading(true);

      const response = await axiosInstance.get(
        `/api/onboarding?limit=${ALUMNI_COUNT}&sort=-createdAt`,
      );

      const data = response.data?.data || [];
      setAlumni(data);
    } catch (err) {
      console.error("Failed to fetch alumni", err);
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  }

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getCompany = (person: AlumniData) => {
    return (
      person.currentCompany_display ||
      person.currentCompany ||
      person.experiences?.find((exp) => exp.isCurrent)?.company_display ||
      person.experiences?.find((exp) => exp.isCurrent)?.company ||
      null
    );
  };

  const getRole = (person: AlumniData) => {
    return (
      person.jobRoles?.[0] ||
      person.experiences?.find((exp) => exp.isCurrent)?.role ||
      null
    );
  };

  const getCollege = (person: AlumniData) => {
    return (
      person.educations?.[0]?.college_display ||
      person.educations?.[0]?.college ||
      null
    );
  };

  const getLocation = (person: AlumniData) => {
    return person.locations?.[0] || null;
  };

  const getUserType = (person: AlumniData) => {
    return person.profileType || "member";
  };

  const handleViewProfile = (userId: string) => {
    if (isAuthenticated && role) {
      router.push(`/${role.toLowerCase()}/profile/${userId}`);
    } else {
      router.push(
        `/login?redirect=${encodeURIComponent(`/profile/${userId}`)}`,
      );
    }
  };

  const handleCreateProfile = () => {
    router.push("/signup");
  };

  // Authenticated users don't need a "create profile" nudge — send them
  // somewhere useful instead, e.g. the main discovery / jobs feed.
  const handleExploreMore = () => {
    router.push("/explore");
  };

  if (loading) {
    return (
      <section className="app-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-[var(--primary)] border-t-transparent" />
                <div className="absolute inset-0 h-8 w-8 animate-pulse rounded-full bg-[var(--primary-soft)] blur-xl" />
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Loading community...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="app-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            

            <h2 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl md:text-3xl">
              Welcome New Members
            </h2>

            <p className="mt-1.5 font-mono text-sm  font-m text-[var(--text-secondary)]">
              See who's joining the Referd community
            </p>
          </div>

          {/* Refresh Timer */}
        </div>

        {/* Alumni Grid */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {alumni.map((person, index) => (
            <div
              key={person._id || index}
              className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 shadow-sm transition-all hover:border-[var(--primary)]/40 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-sm font-bold text-white ring-2 ring-[var(--primary-soft)]">
                    {person.profileImage ? (
                      <img
                        src={person.profileImage}
                        alt={person.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(person.name)
                    )}
                  </div>
                  
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-[var(--text-primary)]">
                    {person.name || "Anonymous"}
                  </h3>

                  {getRole(person) && (
                    <p className="truncate text-xs font-medium text-[var(--primary)]">
                      {getRole(person)}
                    </p>
                  )}

                  <div className="mt-1.5 space-y-0.5">
                    {getCompany(person) && (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 shrink-0 text-[var(--text-subtle)]" />
                        <span className="truncate text-[11px] text-[var(--text-secondary)]">
                          {getCompany(person)}
                        </span>
                      </div>
                    )}

                    {getCollege(person) && (
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3 shrink-0 text-[var(--text-subtle)]" />
                        <span className="truncate text-[11px] text-[var(--text-secondary)]">
                          {getCollege(person)}
                        </span>
                      </div>
                    )}

                    {getLocation(person) && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0 text-[var(--text-subtle)]" />
                        <span className="truncate text-[11px] text-[var(--text-secondary)]">
                          {getLocation(person)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* User Type Badge */}
                  <div className="mt-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--background-soft)] px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                      <CheckCircle className="h-2.5 w-2.5 text-[var(--primary)]" />
                      {getUserType(person)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleViewProfile(person.userId)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--primary-soft)] px-3 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>

        {alumni.length > 0 && !isAuthenticated && (
          <div className="mt-8 rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--primary-soft)] to-transparent p-5">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[var(--primary)] p-2">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    Join the Growing Community
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {alumni.length} new members joined recently. Be part of the
                    network.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCreateProfile}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--primary-hover)] hover:shadow-md"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Create Your Profile
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* Empty State — also auth-aware */}
        {alumni.length === 0 && !loading && !isAuthenticated && (
          <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-soft)]">
              <Users className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">
              Be the First to Join
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Create your profile and connect with professionals from your
              college.
            </p>
            <button
              onClick={handleCreateProfile}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Create Your Profile
            </button>
          </div>
        )}

        {alumni.length === 0 && !loading && isAuthenticated && (
          <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-soft)]">
              <Users className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">
              No new members yet
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Check back soon — new members show up here as they join.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
