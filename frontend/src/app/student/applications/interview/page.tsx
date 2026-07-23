"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getInterviews, getUnreadInterviews } from "@/services/navbar.service";
import { Interview } from "@/types/navbar";
import InterviewList from "@/components/Interviews/InterviewList";

export default function FresherInterviewsPage() {
  const router = useRouter();
  const { profile, user } = useAuth();
  const userType = profile?.profileType || user?.userType || "fresher";
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [unreadInterviews, setUnreadInterviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const [allRes, unreadRes] = await Promise.all([
          getInterviews(),
          getUnreadInterviews(),
        ]);
        setInterviews(allRes.data);
        setUnreadInterviews(unreadRes.data.map((item: any) => item._id));
      } catch (err) {
        console.log("Error fetching interviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const handleInterviewClick = (interviewId: string) => {
    router.push(`/${userType}/applications/interview/${interviewId}`);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">My Interviews</h1>
        <InterviewList
          interviews={interviews}
          unreadInterviews={unreadInterviews}
          loading={loading}
          userType={userType}
          onInterviewClick={handleInterviewClick}
        />
      </div>
    </div>
  );
}