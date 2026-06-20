"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfessionalJobsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/professional/jobs/referral-jobs");
  }, [router]);

  return null;
}