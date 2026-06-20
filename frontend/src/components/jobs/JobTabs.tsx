"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function JobTabs() {
  const pathname = usePathname();

  return (
    // <div className="flex gap-4 mb-6">
    //   <Link
    //     href="/student/jobs/offcampus"
    //     className={`px-4 py-2 rounded-lg ${
    //       pathname.includes("offcampus")
    //         ? "bg-green-500 text-black"
    //         : "bg-zinc-800 text-white"
    //     }`}
    //   >
    //     Off Campus
    //   </Link>

    //   <Link
    //     href="/student/jobs/referral-jobs"
    //     className={`px-4 py-2 rounded-lg ${
    //       pathname.includes("referral-jobs")
    //         ? "bg-green-500 text-black"
    //         : "bg-zinc-800 text-white"
    //     }`}
    //   >
    //     Referral Jobs
    //   </Link>
    // </div>


<div className="mb-6 flex gap-10 border-b border-[var(--border)] ml-5">
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
  );
}




