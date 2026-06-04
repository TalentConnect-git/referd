import DashboardLayout from "@/components/DashboardLayout";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}