"use client"
import { PostedByReferrerProps } from "@/types/dashboard";
import { getAlumniDetails } from "@/services/alumani.services";
import { Alumni } from "@/types/alumni";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


export default function PostedByReferrer({candidateId}:PostedByReferrerProps)
{
    const router = useRouter();
    const { profile: authProfile } = useAuth();
    const userType = authProfile?.profileType;
    const [profile, setProfile] = useState<Alumni | null>(null);
    const [loading, setLoading] = useState(true);
    const handleViewProfile = () => {
        if (!candidateId || !userType) return;
        router.push(`/${userType}/profile/${candidateId}`);
        };
    useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getAlumniDetails(candidateId);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchProfile();
    }
  }, [candidateId]);


    if (loading) {
    return (
      <p className="text-gray-400">
        Loading...
      </p>
    );
  }

  if (!profile) 
    {
        return null;
    }


      return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">

        <img
          src={profile.profileImage || "/images/default-user.png"} 
          alt={profile.name}
          className="h-16 w-16 rounded-full object-cover"
        />

        <div>
          <h3 className="text-lg font-semibold text-white">
            Posted by Referrer
          </h3>

          <p className="text-white">
            {profile.name}
          </p>

          <p className="text-sm text-gray-400">
            {profile.currentCompany_display}
          </p>
        </div>

      </div>

      <div className="flex gap-3">

        <button className="rounded-lg border border-green-500 px-5 py-2 text-white hover:bg-green-500 hover:text-black">
          Message
        </button>

        <button onClick={handleViewProfile} className="rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-400">
          View Profile
        </button>

      </div>
    </div>
  );

}




