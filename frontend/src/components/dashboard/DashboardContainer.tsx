"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// Lazy load components
const DashboardHeader = lazy(() => import("@/components/dashboard/DashboardHeader"));
const DashboardStats = lazy(() => import("@/components/dashboard/DashboardStats"));
const DashboardBody = lazy(() => import("@/components/dashboard/DashboardBody"));
const DashboardAlumini = lazy(() => import("@/components/dashboard/DashboardAlumini"));
const IncomingRequests = lazy(() => import("@/components/dashboard/IncomingRequests"));
// const FloatingMessage = lazy(() => import("@/components/chats/FloatingMessage"));

// ==========================================
// PROFESSIONAL SKELETON COMPONENTS
// Using your CSS variables
// ==========================================

// Shimmer skeleton for header
const HeaderSkeleton = () => (
  <div className="surface-card p-4 sm:p-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="skeleton shimmer w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <div className="skeleton shimmer h-5 w-32 rounded" />
          <div className="skeleton shimmer h-3.5 w-20 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="skeleton shimmer h-8 w-24 rounded" />
        <div className="skeleton shimmer h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

// Shimmer skeleton for stats cards
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="surface-card p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="skeleton shimmer h-3.5 w-20 rounded" />
            <div className="skeleton shimmer h-7 w-16 rounded" />
          </div>
          <div className="skeleton shimmer h-9 w-9 rounded-full" />
        </div>
        <div className="mt-3 pt-3 border-t border-theme">
          <div className="skeleton shimmer h-3 w-24 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// Shimmer skeleton for incoming requests
const RequestsSkeleton = () => (
  <div className="surface-card p-4 sm:p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="skeleton shimmer h-5 w-40 rounded" />
      <div className="skeleton shimmer h-7 w-20 rounded" />
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background-soft">
          <div className="skeleton shimmer h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <div className="skeleton shimmer h-4 w-28 rounded" />
            <div className="skeleton shimmer h-3 w-20 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="skeleton shimmer h-7 w-16 rounded" />
            <div className="skeleton shimmer h-7 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Shimmer skeleton for dashboard body
const BodySkeleton = () => (
  <div className="surface-card p-4 sm:p-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div className="skeleton shimmer h-5 w-36 rounded" />
      <div className="flex gap-2">
        <div className="skeleton shimmer h-8 w-24 rounded" />
        <div className="skeleton shimmer h-8 w-24 rounded" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="skeleton shimmer h-4 w-32 rounded" />
        <div className="skeleton shimmer h-20 w-full rounded" />
        <div className="skeleton shimmer h-20 w-full rounded" />
      </div>
      <div className="space-y-3">
        <div className="skeleton shimmer h-4 w-32 rounded" />
        <div className="skeleton shimmer h-20 w-full rounded" />
        <div className="skeleton shimmer h-20 w-full rounded" />
      </div>
    </div>
  </div>
);

// Shimmer skeleton for alumni
const AlumniSkeleton = () => (
  <div className="surface-card p-4 sm:p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="skeleton shimmer h-5 w-32 rounded" />
      <div className="skeleton shimmer h-7 w-24 rounded" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col items-center p-3 rounded-lg bg-background-soft">
          <div className="skeleton shimmer h-12 w-12 rounded-full" />
          <div className="skeleton shimmer h-3.5 w-20 mt-2 rounded" />
          <div className="skeleton shimmer h-3 w-16 mt-1 rounded" />
        </div>
      ))}
    </div>
  </div>
);

// ==========================================
// STAGGERED LOADING WRAPPER
// For professional staggered animation
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

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// ==========================================
// MAIN DASHBOARD CONTAINER
// ==========================================

export default function DashboardContainer() {
  const { profile, role } = useAuth();
  const userName = profile?.name || "User";
  const userRole = role || profile?.profileType || "student";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
        {/* Header Section - Staggered loading */}
        <div className="mb-2 sm:mb-4 animate-fade-in">
          <StaggeredSuspense fallback={<HeaderSkeleton />} delay={0}>
            <DashboardHeader userName={userName} userType={userRole} />
          </StaggeredSuspense>
        </div>

        {/* Stats Section - Staggered with delay */}
        <div className="mb-2 sm:mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <StaggeredSuspense fallback={<StatsSkeleton />} delay={150}>
            <DashboardStats userType={userRole} />
          </StaggeredSuspense>
        </div>

        {/* Incoming Requests Section - Only for professional */}
        {userRole === "professional" && (
          <div className="mb-2 sm:mb-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <StaggeredSuspense fallback={<RequestsSkeleton />} delay={300}>
              <IncomingRequests />
            </StaggeredSuspense>
          </div>
        )}

        {/* Main Body Section */}
        <div className="mb-2 sm:mb-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <StaggeredSuspense fallback={<BodySkeleton />} delay={450}>
            <DashboardBody />
          </StaggeredSuspense>
        </div>

        {/* Alumni Section */}
        <div className="mb-2 sm:mb-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <StaggeredSuspense fallback={<AlumniSkeleton />} delay={600}>
            <DashboardAlumini userType={userRole} />
          </StaggeredSuspense>
        </div>

        {/* Floating Message - Commented out */}
        {/* <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in" style={{ animationDelay: '500ms' }}>
          <Suspense fallback={null}>
            <FloatingMessage />
          </Suspense>
        </div> */}
      </div>
    </div>
  );
}