"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getInterviewById, markInterviewAsRead } from "@/services/navbar.service";
import InterviewDetail from "@/components/Interviews/InterviewDetail";

export default function StudentInterviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;
  const { profile, user } = useAuth();
  const userType = profile?.profileType || user?.userType || "student";

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await getInterviewById(interviewId);
        setInterview(res.data);
        await markInterviewAsRead(interviewId);
      } catch (err) {
        console.log("Error fetching interview:", err);
        setError("Failed to load interview details");
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [interviewId]);

  const handleBack = () => {
    router.push(`/${userType}/applications/interview`);
  };

  return (
    <InterviewDetail
      interview={interview}
      loading={loading}
      error={error}
      userType={userType}
      onBack={handleBack}
    />
  );
}