"use client";

import { useParams } from "next/navigation";
import { getCandidateProfile } from "@/services/profile.service";
import {useState,useEffect} from "react";
import { ProfileData } from "@/types/profile";
import ProfileContainer from "@/components/profile/CandidateProfile/ProfileContainer";

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
        return <div>Loading...</div>;
    }
    if (!profile) {
        return <div>Profile not found.</div>;
    }

  return (
    <>
    <ProfileContainer profile={profile}/>
    </>
  );
}