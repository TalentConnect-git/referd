import { DashboardLayout } from "@/components/DashboardLayout";
import { professionalNavItems } from "@/constants/navigation";
import type { CandidateRole } from "@/components/DashboardLayout";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role: CandidateRole = "fresher";

  return (
    <DashboardLayout navItems={professionalNavItems} role={role}>
      {children}
    </DashboardLayout>
  );
}