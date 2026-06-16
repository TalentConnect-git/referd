import { DashboardLayout } from "@/components/DashboardLayout";
import { studentNavItems } from "@/constants/navigation";
import type { CandidateRole } from "@/components/DashboardLayout";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role: CandidateRole = "student";

  return (
    <DashboardLayout navItems={studentNavItems} role={role}>
      {children}
    </DashboardLayout>
  );
}