import { DashboardLayout } from "@/components/DashboardLayout";
import { studentNavItems } from "@/constants/navigation";
import type { CandidateRole } from "@/components/DashboardLayout";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "react-hot-toast";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role: CandidateRole = "student";

  return (
    <>
    <Navbar />
    <DashboardLayout navItems={studentNavItems} role={role}>
      {children}
      <Toaster position="top-right" />
    </DashboardLayout>
    </>
  );
}