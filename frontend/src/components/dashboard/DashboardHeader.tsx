"use client";

import Link from "next/link";
import { DashboardHeaderProps } from "@/types/dashboard";
import { useRouter } from "next/navigation";
import { PlusCircle, UserPlus } from "lucide-react";

export default function DashboardHeader({
  userName,
  userType,
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleAskForReferral = () => {
    router.push(`/${userType}/referral-jobs`);
  };

  return (
    <div className="surface-card rounded-2xl p-5">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Welcome back, {userName}
          </h1>

          <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
            Here is what is happening with your dashboard today.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
          {userType === "professional" && (
            <Link
              href="/professional/post-referral"
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Post a Referral</span>
            </Link>
          )}

          <button
            onClick={handleAskForReferral}
            className="btn-secondary inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <UserPlus className="h-4 w-4" />
            <span>Ask for Referral</span>
          </button>
        </div>
      </div>
    </div>
  );
}