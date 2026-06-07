"use client";

type DashboardHeaderProps = {
  userName: string;
};

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h1 className="text-2xl font-bold text-white">
        Welcome back, {userName}
      </h1>

      <p className="mt-2 text-sm text-[var(--text-primary)]">
        Here is what is happening with your dashboard today.
      </p>
    </div>
  );
}