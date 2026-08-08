"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import Navbar from "@/components/navbar/Navbar";
import { fresherNavItems } from "@/constants/navigation";
import type { CandidateRole } from "@/components/DashboardLayout";
import { Toaster } from "react-hot-toast";
import useGetSocketMessage from "@/hooks/useGetSocketMessage";
import AuthGuard from "@/components/auth/AuthGuard";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role: CandidateRole = "fresher";

  useGetSocketMessage();

  return (
    <>
      <AuthGuard>
        <Navbar />

        <DashboardLayout navItems={fresherNavItems} role={role}>
          {children}
        </DashboardLayout>

        <Toaster position="top-right" />
      </AuthGuard>
    </>
  );
}
