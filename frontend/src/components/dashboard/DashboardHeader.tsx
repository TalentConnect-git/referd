"use client";
import Link from "next/link";
import { DashboardHeaderProps } from "@/types/dashboard";
export default function DashboardHeader({ userName,userType }: DashboardHeaderProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 ml-4 mt-2">
  <div className="flex items-center justify-between">

    <div>
      <h1 className="text-2xl font-bold text-white">
        Welcome back, {userName}
      </h1>

      <p className="mt-2 text-sm text-[var(--text-primary)]">
        Here is what is happening with your dashboard today.
      </p>
    </div>

    {userType === "professional" && (
      <Link
        href="/professional/post-referral"
        className="rounded-lg bg-green-500 px-3 py-2 font-medium text-black transition hover:bg-green-400"
      >
        Post a Referral
      </Link>
    )}

  </div>
</div>
  );
}