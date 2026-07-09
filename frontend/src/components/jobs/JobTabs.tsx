"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserPlus } from "lucide-react";

export default function JobTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const { role } = useAuth();

  const handleAskForReferral = () => {
    if (!role) return;
    router.push(`/${role}/referral-jobs`);
  };

  return (
    <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] px-4">
      {/* Left Tabs */}
      <div className="flex gap-8">
        <Link
          href={`/${role}/jobs/offcampus`}
          className={`pb-2 text-sm font-medium transition-colors ${
            pathname.includes("offcampus")
              ? "border-b-2 border-green-500 text-green-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Off-campus
        </Link>

        <Link
          href={`/${role}/jobs/referral-jobs`}
          className={`pb-2 text-sm font-medium transition-colors ${
            pathname.includes("referral-jobs")
              ? "border-b-2 border-green-500 text-green-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Referral
        </Link>
      </div>

      {/* Right Button */}
      <button
        onClick={handleAskForReferral}
        className="inline-flex items-center gap-1.5 rounded-md border border-white/30 bg-transparent px-3 py-1.5 mb-1 text-xs font-medium text-white transition-all duration-200 hover:border-white hover:bg-white/10"
      >
        <UserPlus className="h-3.5 w-3.5" />
        <span>Ask for Referral</span>
      </button>
    </div>
  );
}