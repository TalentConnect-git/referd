"use client";

import { lazy, Suspense, useCallback, useEffect, useState, useRef } from "react";
import {
  getProfessionalStats,
  getCandidateStats,
  getCareerInsights,
} from "@/services/stats.services";
import axiosInstance from "@/lib/axiosInstance";
import { DashboardStatsProps } from "@/types/dashboard";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  UserPlus, 
  Users, 
  ChevronRight,
  Briefcase,
  Star,
  Clock,
  CheckCircle,
  Calendar,
  Award,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Building2,
  Zap,
  Eye
} from "lucide-react";

// Lazy load child components
const DashboardProfStats = lazy(() => import("./DashboardProfStats"));
const DashboardStudStats = lazy(() => import("./DashboardStudStats"));
const QuickActionChips = lazy(() => import("./QuickActionChips"));

// ==========================================
// SKELETON LOADING COMPONENTS
// ==========================================

// Professional stats skeleton
const ProfStatsSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div
        key={i}
        className="surface-card rounded-xl p-3.5 border border-[var(--border)]"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="skeleton shimmer h-2.5 w-16 rounded" />
            <div className="skeleton shimmer h-5 w-12 rounded" />
            <div className="skeleton shimmer h-2 w-14 rounded" />
          </div>
          <div className="skeleton shimmer h-7 w-7 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// Student stats skeleton
const StudStatsSkeleton = () => (
  <div className="space-y-4">
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton shimmer h-8 w-24 rounded-full" />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="surface-card rounded-xl p-3.5 border border-[var(--border)]"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="skeleton shimmer h-2.5 w-16 rounded" />
              <div className="skeleton shimmer h-5 w-12 rounded" />
              <div className="skeleton shimmer h-2 w-14 rounded" />
            </div>
            <div className="skeleton shimmer h-7 w-7 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Main loading skeleton
const MainSkeleton = () => (
  <div className="flex flex-wrap gap-4">
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <div
        key={item}
        className="skeleton min-w-[140px] flex-1 h-28 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
      />
    ))}
  </div>
);

// Alumni Section Skeleton
const AlumniSectionSkeleton = () => (
  <div className="card p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="skeleton shimmer h-5 w-5 rounded-lg" />
        <div className="skeleton shimmer h-4 w-28 rounded" />
        <div className="skeleton shimmer h-4 w-6 rounded-full" />
      </div>
      <div className="skeleton shimmer h-3 w-12 rounded" />
    </div>
    <div className="space-y-2">
      {[1, 2].map((i) => (
        <div key={i} className="skeleton shimmer h-14 rounded-lg" />
      ))}
    </div>
  </div>
);

// ==========================================
// STAGGERED SUSPENSE WRAPPER
// ==========================================

interface StaggeredSuspenseProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  delay?: number;
}

const StaggeredSuspense = ({ children, fallback, delay = 0 }: StaggeredSuspenseProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return <Suspense fallback={fallback}>{children}</Suspense>;
};

// ==========================================
// TYPES
// ==========================================

type CountResponse = {
  data?: {
    data?: unknown[];
    meta?: {
      total?: number;
    };
  };
};

interface AlumniPostedJob {
  jobId: string;
  alumniId: string;
  message: string;
}

interface AlumniReferredStatus {
  alumniId: string;
  jobId: string;
  currentStatus: string;
  message: string;
}

type SliderItem = 
  | (AlumniPostedJob & { type: 'posted' })
  | (AlumniReferredStatus & { type: 'referred' });

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function DashboardStats({ userType }: DashboardStatsProps) {
  const router = useRouter();
  const { user, role } = useAuth();
  
  // Professional Stats
  const [totalReferralsPosted, setTotalReferralsPosted] = useState(0);
  const [totalApplicationsReceived, setTotalApplicationsReceived] = useState(0);
  const [responseRate, setResponseRate] = useState(0);
  const [referralSuccessRate, setReferralSuccessRate] = useState(0);
  const [candidatesWaiting, setCandidatesWaiting] = useState(0);
  const [alumniCount, setAlumniCount] = useState(0);

  // Student/Fresher Stats
  const [applicationsSent, setApplicationsSent] = useState(0);
  const [resumeScore, setResumeScore] = useState(0);
  const [hiringScore, setHiringScore] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [studentAlumniCount, setStudentAlumniCount] = useState(0);

  // Alumni Jobs Data
  const [alumniPostedJobs, setAlumniPostedJobs] = useState<AlumniPostedJob[]>([]);
  const [alumniReferredStatus, setAlumniReferredStatus] = useState<AlumniReferredStatus[]>([]);
  const [alumniJobsLoading, setAlumniJobsLoading] = useState(true);

  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const [loading, setLoading] = useState(true);

  // Auto-play for slider
  useEffect(() => {
    const totalItems = alumniPostedJobs.length + alumniReferredStatus.length;
    if (totalItems > 0 && isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
      }, 4000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [alumniPostedJobs.length, alumniReferredStatus.length, isAutoPlaying]);

  // Helper function to safely get count from API response
  const getCountFromResponse = (response: CountResponse): number => {
    if (!response?.data) return 0;
    return response.data?.data?.length || response.data?.meta?.total || 0;
  };

  // Function to fetch total alumni count
  const fetchTotalAlumniCount = useCallback(async () => {
    try {
      const DEFAULT_LIMIT = 10;
      const [hiringResponse] = await Promise.all([
        axiosInstance
          .get(
            `/api/candidate/hiring-network?jobPostedOnly=true&page=1&limit=${DEFAULT_LIMIT}`,
          )
          .catch(() => ({ data: { data: [] } })),
      ]);
      const hiringCount = getCountFromResponse(hiringResponse);
      return hiringCount;
    } catch (error) {
      console.error("Error fetching alumni counts:", error);
      return 0;
    }
  }, []);

  // Fetch alumni posted jobs from /jobs/alumni-posted
  const fetchAlumniPostedJobs = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/jobs/alumni-posted');
      if (response.data.success && response.data.data) {
        setAlumniPostedJobs(response.data.data);
      } else {
        setAlumniPostedJobs([]);
      }
    } catch (error) {
      console.error('Error fetching alumni posted jobs:', error);
      setAlumniPostedJobs([]);
    }
  }, []);

  // Fetch alumni referred status from /application/alumni-referred
  const fetchAlumniReferredStatus = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/application/alumni-referred');
      if (response.data.success && response.data.data) {
        setAlumniReferredStatus(response.data.data);
      } else {
        setAlumniReferredStatus([]);
      }
    } catch (error) {
      console.error('Error fetching alumni referred status:', error);
      setAlumniReferredStatus([]);
    }
  }, []);

  // Fetch all alumni jobs data
  const fetchAlumniJobsData = useCallback(async () => {
    try {
      setAlumniJobsLoading(true);
      await Promise.all([
        fetchAlumniPostedJobs(),
        fetchAlumniReferredStatus()
      ]);
    } catch (error) {
      console.error('Error fetching alumni jobs data:', error);
    } finally {
      setAlumniJobsLoading(false);
    }
  }, [fetchAlumniPostedJobs, fetchAlumniReferredStatus]);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      await fetchAlumniJobsData();
      const totalAlumni = await fetchTotalAlumniCount();

      if (userType === "professional") {
        const [profData, candidatesResponse] = await Promise.all([
          getProfessionalStats().catch(() => ({ data: {} })),
          axiosInstance
            .get(`/application/all-referrals`)
            .catch(() => ({ data: { data: [] } })),
        ]);

        const metrics = profData?.data ?? profData;
        const candidatesList = candidatesResponse?.data?.data || [];

        setTotalReferralsPosted(metrics?.totalReferralsPosted ?? 0);
        setTotalApplicationsReceived(metrics?.totalApplicationsReceived ?? 0);
        setResponseRate(metrics?.responseRate ?? 0);
        setReferralSuccessRate(metrics?.referralSuccessRate ?? 0);
        setCandidatesWaiting(candidatesList.length);
        setAlumniCount(totalAlumni);
      } else if (userType === "student" || userType === "fresher") {
        const [statsData, insightsData] = await Promise.all([
          getCandidateStats().catch(() => ({ data: {} })),
          getCareerInsights().catch(() => ({ data: {} })),
        ]);

        const stats = statsData?.data ?? {};
        const insights = insightsData?.data ?? {};

        setApplicationsSent(stats?.totalApplications ?? 0);
        setSavedCount(stats?.savedCount ?? 0);
        setResumeScore(insights?.resumeScore ?? 0);
        setHiringScore(insights?.hiringScore ?? 0);
        setStudentAlumniCount(totalAlumni);
      }
    } catch (error) {
      console.error(`Error fetching ${userType} stats:`, error);
      if (userType === "professional") {
        setTotalReferralsPosted(0);
        setTotalApplicationsReceived(0);
        setResponseRate(0);
        setReferralSuccessRate(0);
        setCandidatesWaiting(0);
        setAlumniCount(0);
      } else {
        setApplicationsSent(0);
        setSavedCount(0);
        setResumeScore(0);
        setHiringScore(0);
        setStudentAlumniCount(0);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchTotalAlumniCount, fetchAlumniJobsData, userType]);

  useEffect(() => {
    if (userType) {
      const timer = window.setTimeout(() => {
        void fetchDashboardStats();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [fetchDashboardStats, userType]);

  // Handle job click - redirect to role-based job page (for posted jobs)
  const handleJobClick = (jobId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const matchScore = Math.floor(Math.random() * 40) + 60;
    router.push(`/${role}/jobs/referral-jobs/${jobId}?matchScore=${matchScore}`);
  };

  // Handle view for referred status - redirect to alumni profile
  const handleReferredViewClick = (alumniId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/${role}/profile/${alumniId}`);
  };

  // Handle alumni click
  const handleAlumniClick = (alumniId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/${role}/profile/${alumniId}`);
  };

  // Extract alumni info from message for posted jobs
  const extractAlumniInfo = (message: string) => {
    const match = message.match(/^([^(]+)\s*\(([^)]+)\)\s*posted a job for\s*(.+)/);
    if (match) {
      return {
        name: match[1].trim(),
        organization: match[2].trim(),
        jobRole: match[3].trim()
      };
    }
    return {
      name: 'Alumni',
      organization: 'Organization',
      jobRole: 'position'
    };
  };

  // Extract referral info from message for referred status
  const extractReferralInfo = (message: string) => {
    const match = message.match(/^([^(]+)\s*\(([^)]+)\)\s*got referred to\s*(.+?)\s*@(.+)/);
    if (match) {
      return {
        name: match[1].trim(),
        organization: match[2].trim(),
        jobRole: match[3].trim(),
        company: match[4].trim()
      };
    }
    return {
      name: 'Alumni',
      organization: 'Organization',
      jobRole: 'position',
      company: 'Company'
    };
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'shortlisted': 'badge-info',
      'referred to company': 'badge-info',
      'interview scheduled': 'badge-warning',
      'offer extended': 'badge-success',
      'offer accepted': 'badge-primary',
      'rejected': 'badge-danger',
      'pending': 'badge-warning'
    };
    return statusMap[status.toLowerCase()] || 'badge';
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    const statusMap: Record<string, any> = {
      'shortlisted': Users,
      'referred to company': Users,
      'interview scheduled': Calendar,
      'offer extended': Award,
      'offer accepted': CheckCircle,
      'rejected': Clock,
      'pending': Clock
    };
    return statusMap[status.toLowerCase()] || Clock;
  };

  // Render Alumni Sections with Motion Slider
  const renderAlumniSections = () => {
    if (alumniJobsLoading) {
      return <AlumniSectionSkeleton />;
    }

    const totalItems = alumniPostedJobs.length + alumniReferredStatus.length;
    if (totalItems === 0) {
      return null;
    }

    // Combine both lists for slider
    const allItems: SliderItem[] = [
      ...alumniPostedJobs.map(item => ({ ...item, type: 'posted' as const })),
      ...alumniReferredStatus.map(item => ({ ...item, type: 'referred' as const }))
    ];

    const currentItem = allItems[currentIndex % allItems.length];

    return (
      <div className="card p-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[var(--primary-soft)]">
              <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Alumni Activity
            </h3>
            <span className="text-xs text-[var(--text-muted)] bg-[var(--background-soft)] px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-1 rounded hover:bg-[var(--card-hover)] transition-colors"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isAutoPlaying ? 'bg-[var(--primary)]' : 'bg-[var(--text-muted)]'}`} />
            </button>
            <div className="flex gap-1">
              {allItems.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentIndex % 5 
                      ? 'w-4 bg-[var(--primary)]' 
                      : 'w-1.5 bg-[var(--text-muted)] hover:bg-[var(--primary)]/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Slider Item */}
        <div 
          className="p-3 rounded-lg bg-[var(--background-soft)] hover:bg-[var(--card-hover)] transition-colors cursor-pointer border border-[var(--border)] relative overflow-hidden min-h-[72px] flex items-center"
          onClick={() => {
            if (currentItem.type === 'posted') {
              handleJobClick(currentItem.jobId);
            } else {
              handleReferredViewClick(currentItem.alumniId);
            }
          }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {currentItem.type === 'posted' ? (
            // Alumni Posted Job - View redirects to job page
            (() => {
              const info = extractAlumniInfo(currentItem.message);
              return (
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-[var(--primary-soft)] flex items-center justify-center">
                      <UserPlus className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      <span className="font-semibold text-[var(--text-primary)]">{info.name}</span>
                      <span className="text-[var(--text-muted)]"> ({info.organization})</span>
                      <span className="text-[var(--text-secondary)]"> posted </span>
                      <span className="font-medium text-[var(--primary)]">{info.jobRole}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                      className="btn-primary text-xs px-3 py-1 min-h-[1.75rem] flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobClick(currentItem.jobId);
                      }}
                    >
                      View
                    </button>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                  </div>
                </div>
              );
            })()
          ) : (
            // Alumni Referred Status - View redirects to alumni profile
            (() => {
              const info = extractReferralInfo(currentItem.message);
              const StatusIcon = getStatusIcon(currentItem.currentStatus);
              const statusColor = getStatusColor(currentItem.currentStatus);
              return (
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-[var(--primary-soft)] flex items-center justify-center">
                      <Zap className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      <span className="font-semibold text-[var(--text-primary)]">{info.name}</span>
                      <span className="text-[var(--text-muted)]"> ({info.organization})</span>
                      <span className="text-[var(--text-secondary)]"> → </span>
                      <span className="font-medium text-[var(--primary)]">{info.jobRole}</span>
                      <span className="text-[var(--text-secondary)]"> @ </span>
                      <span className="font-medium text-[var(--text-primary)]">{info.company}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge ${statusColor} text-[10px] px-2 py-0.5 flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {currentItem.currentStatus}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                      className="btn-primary text-xs px-3 py-1 min-h-[1.75rem] flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReferredViewClick(currentItem.alumniId);
                      }}
                    >
                      View
                    </button>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                  </div>
                </div>
              );
            })()
          )}

         
        </div>

       
      </div>
    );
  };

  // Show main skeleton while loading
  if (loading) {
    return <MainSkeleton />;
  }

  // Professional Dashboard
  if (userType === "professional") {
    return (
      <>
        <StaggeredSuspense fallback={<ProfStatsSkeleton />} delay={0}>
          <DashboardProfStats
            totalReferralsPosted={totalReferralsPosted}
            totalApplicationsReceived={totalApplicationsReceived}
            responseRate={responseRate}
            referralSuccessRate={referralSuccessRate}
            candidatesWaiting={candidatesWaiting}
            alumniCount={alumniCount}
            userType={userType}
          />
        </StaggeredSuspense>
        
        {/* Alumni Sections with Motion Slider */}
        {renderAlumniSections()}
      </>
    );
  }

  // Student/Fresher Dashboard
  if (userType === "student" || userType === "fresher") {
    return (
      <div className="space-y-4">
        <StaggeredSuspense fallback={null} delay={0}>
          <QuickActionChips userType={userType} />
        </StaggeredSuspense>

        <StaggeredSuspense fallback={<StudStatsSkeleton />} delay={100}>
          <DashboardStudStats
            applicationsSent={applicationsSent}
            savedCount={savedCount}
            resumeScore={resumeScore}
            hiringScore={hiringScore}
            alumniCount={studentAlumniCount}
            userType={userType}
          />
        </StaggeredSuspense>

        {/* Alumni Sections with Motion Slider */}
        {renderAlumniSections()}
      </div>
    );
  }

  return null;
}