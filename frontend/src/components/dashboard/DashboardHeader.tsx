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
    <div className="rounded-2xl ml-4 mr-4 border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            Welcome back, {userName}
          </h1>

          <p className="mt-1.5 text-xs text-[var(--text-primary)]">
            Here is what is happening with your dashboard today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {userType === "professional" && (
            <Link
              href="/professional/post-referral"
              className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-3.5 py-2 text-sm font-medium text-black transition-all duration-200 hover:bg-green-400 hover:shadow-lg"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Post a Referral</span>
            </Link>
          )}

          <button
            onClick={handleAskForReferral}
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-transparent px-3.5 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-white hover:bg-white/10"
          >
            <UserPlus className="h-4 w-4" />
            <span>Ask for Referral</span>
          </button>
        </div>
      </div>
    </div>
  );
}