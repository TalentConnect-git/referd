import { DashboardLayout } from "@/components/DashboardLayout";
import { fresherNavItems } from "@/constants/navigation";
import type { CandidateRole } from "@/components/DashboardLayout";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar/Navbar";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role: CandidateRole = "fresher";

  return (
      <>
      <Navbar />
      <DashboardLayout navItems={fresherNavItems} role={role}>
      {children}
      <Toaster position="top-right" />
    </DashboardLayout>
      </>
  );
}