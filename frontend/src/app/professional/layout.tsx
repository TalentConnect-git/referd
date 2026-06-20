import { DashboardLayout } from "@/components/DashboardLayout";
import { professionalNavItems } from "@/constants/navigation";
import type { CandidateRole } from "@/components/DashboardLayout";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar/Navbar";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role: CandidateRole = "professional";

  return (
    <>
    <Navbar />
    <DashboardLayout navItems={professionalNavItems} role={role}>
      {children}
      <Toaster position="top-right" />
    </DashboardLayout>
    </>
  );
}