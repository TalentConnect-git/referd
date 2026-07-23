"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import Navbar from "@/components/navbar/Navbar";
import { professionalNavItems } from "@/constants/navigation";
import type { CandidateRole } from "@/components/DashboardLayout";
import { Toaster } from "react-hot-toast";
import useGetSocketMessage from "@/hooks/useGetSocketMessage";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role: CandidateRole = "professional";

  // Start socket listener globally
  useGetSocketMessage();

  return (
    <>
      <Navbar />

      <DashboardLayout navItems={professionalNavItems} role={role}>
        {children}
      </DashboardLayout>

      <Toaster position="top-right" />
    </>
  );
}