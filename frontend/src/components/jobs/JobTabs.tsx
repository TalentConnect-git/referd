"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Update the path if needed

export default function JobTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const { role } = useAuth();

  const handleAskForReferral = () => {
    if (!role) return;
    router.push(`/${role}/referral-jobs`);
  };

  return (
    <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] px-5">
      {/* Left Tabs */}
      <div className="flex gap-10">
        <Link
          href="/student/jobs/offcampus"
          className={`pb-3 text-lg font-medium transition-colors ${
            pathname.includes("offcampus")
              ? "border-b-2 border-green-500 text-green-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Off-campus
        </Link>

        <Link
          href="/student/jobs/referral-jobs"
          className={`pb-3 text-lg font-medium transition-colors ${
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
        className="mb-2 flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[var(--primary-dark)] active:scale-95"
      >
        Ask for Referral
      </button>
    </div>
  );
}