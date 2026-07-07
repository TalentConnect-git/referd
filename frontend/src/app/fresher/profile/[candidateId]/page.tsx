// app/candidate/[candidateId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { getCandidateProfile } from "@/services/profile.service";
import { useState, useEffect } from "react";
import { ProfileData } from "@/types/profile";
import ProfileContainer from "@/components/profile/CandidateProfile/ProfileContainer";

export default function CandidateProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.candidateId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCandidateProfile(
          params.candidateId as string
        );
        setProfile(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.candidateId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-2">Error Loading Profile</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-white mb-2">Profile Not Found</h3>
          <p className="text-gray-400">The candidate profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <ProfileContainer profile={profile} />;
}