"use client";

import { useParams } from "next/navigation";
import { getCandidateProfile } from "@/services/profile.service";
import { useState, useEffect } from "react";
import { ProfileData } from "@/types/profile";
import ProfileContainer from "@/components/profile/CandidateProfile/ProfileContainer";
import { Loader2 } from "lucide-react";

export default function CandidateProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.candidateId) return;

    const fetchProfile = async () => {
      try {
        const response = await getCandidateProfile(
          params.candidateId as string
        );

        setProfile(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.candidateId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[var(--background)] px-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          <p className="text-sm text-[var(--text-muted)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[var(--background)] px-4">
        <div className="surface-card max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Profile Not Found
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            The profile you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <ProfileContainer profile={profile} />
    </div>
  );
}