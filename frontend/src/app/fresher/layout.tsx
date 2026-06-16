import { DashboardLayout } from "@/components/DashboardLayout";
import { fresherNavItems } from "@/constants/navigation";
import type { CandidateRole } from "@/components/DashboardLayout";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role: CandidateRole = "fresher";

  return (
    <DashboardLayout navItems={fresherNavItems} role={role}>
      {children}
    </DashboardLayout>
  );
}