"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardBody from "@/components/dashboard/DashboardBody";
import DashboardAlumini from "@/components/dashboard/DashboardAlumini";
import IncomingRequests from "@/components/dashboard/IncomingRequests";
// import FloatingMessage from "@/components/chats/FloatingMessage";
import { useAuth } from "@/context/AuthContext";

export default function DashboardContainer() {
  const { profile, role } = useAuth();
  const userName = profile?.name || "User";
  const userRole = role || profile?.profileType || "student";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-2 sm:mb-4">
          <DashboardHeader userName={userName} userType={userRole} />
        </div>

        {/* Stats Section */}
        <div className="mb-2 sm:mb-4">
          <DashboardStats userType={userRole} />
        </div>

        {/* Incoming Requests Section - Only for professional */}
        {userRole === "professional" && (
          <div className="mb-2 sm:mb-4">
            <IncomingRequests />
          </div>
        )}

        {/* Main Body Section */}
        <div className="mb-2 sm:mb-4">
          <DashboardBody />
        </div>

        {/* Alumni Section */}
        <div className="mb-2 sm:mb-4">
          <DashboardAlumini userType={userRole} />
        </div>

        {/* Floating Message - Commented out for now */}
        {/* <div className="fixed bottom-6 right-6 z-[9999]">
          <FloatingMessage />
        </div> */}
      </div>
    </div>
  );
}