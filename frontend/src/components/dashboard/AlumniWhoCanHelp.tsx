"use client";
import { AlumniWhoCanHelpProps, alumniWhoCanHelp } from "@/types/dashboard";
import { getAlumniWhoCanHelp } from "@/services/alumani.services";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, Briefcase, MessageCircle, ExternalLink, Users, Building2, Mail } from "lucide-react";
import Image from "next/image";

export default function AlumniWhoCanHelp({ job }: AlumniWhoCanHelpProps) {
  const [alumni, setAlumni] = useState<alumniWhoCanHelp[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { role: userType } = useAuth();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const company = job.candidatePosted?.currentCompany || job.companyName || "";
        const response = await getAlumniWhoCanHelp(job._id);
        setAlumni(response.data || []);
      } catch (err) {
        console.error("Error fetching alumni:", err);
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [job]);

  const handleMessage = (e: React.MouseEvent, userId: string, name: string, profileImage?: string) => {
    e.stopPropagation();
    const encodedName = encodeURIComponent(name);
    const encodedImage = profileImage ? encodeURIComponent(profileImage) : "";
    
    router.push(
      `/${userType}/message/${userId}?userName=${encodedName}&profileImage=${encodedImage}`
    );
  };

  const handleProfileClick = (userId: string) => {
    router.push(`/${userType}/profile/${userId}`);
  };

  const handleImageError = (userId: string) => {
    setImageErrors((prev) => ({ ...prev, [userId]: true }));
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-4">
        <div className="flex items-center justify-center gap-3 py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-500/30 border-t-green-500" />
          <span className="text-sm text-gray-400">Loading alumni...</span>
        </div>
      </div>
    );
  }

  if (alumni.length === 0) {
    return (
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-white">Alumni Who Can Help</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="rounded-full bg-gray-800/50 p-3 mb-3">
            <Users size={20} className="text-gray-500" />
          </div>
          <p className="text-sm text-gray-400">No alumni found for this company</p>
          <p className="text-xs text-gray-500 mt-1">Check back later for updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-green-400" />
          <h3 className="text-sm font-semibold text-white">Alumni Who Can Help</h3>
          <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
            {alumni.length}
          </span>
        </div>
        <span className="text-[10px] text-gray-500">Click to view profile</span>
      </div>

      {/* Alumni List */}
      <div className="space-y-2.5">
        {alumni.map((person) => {
          const initials = person.name?.charAt(0)?.toUpperCase() || "A";
          const jobsCount = person.referralJobs?.length || 0;
          const hasImageError = imageErrors[person.userId];

          return (
            <div
              key={person.userId}
              onClick={() => handleProfileClick(person.userId)}
              className="group flex items-center justify-between rounded-xl border border-[#1e293b] bg-[#0f172a] p-3 hover:border-green-500/30 hover:bg-[#1a2332] transition-all duration-200 cursor-pointer"
            >
              {/* Left Section */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar with Profile Image */}
                <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  {person.profileImage && !hasImageError ? (
                    <Image
                      src={person.profileImage}
                      alt={person.name}
                      fill
                      className="rounded-full object-cover border-2 border-green-500/30 group-hover:border-green-500/60 transition-all duration-200"
                      onError={() => handleImageError(person.userId)}
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 group-hover:border-green-500/60 transition-all duration-200 flex items-center justify-center">
                      <span className="text-sm sm:text-base font-bold text-green-400">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors truncate">
                    {person.name}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    {person.currentCompany && (
                      <div className="flex items-center gap-1">
                        <Building2 size={11} className="text-gray-500" />
                        <span className="text-[10px] text-gray-400 truncate max-w-[100px] sm:max-w-[150px]">
                          {person.currentCompany}
                        </span>
                      </div>
                    )}

                    {jobsCount > 0 && (
                      <>
                        <span className="text-gray-600 text-[10px]">•</span>
                        <div className="flex items-center gap-1">
                          <Briefcase size={11} className="text-gray-500" />
                          <span className="text-[10px] text-gray-400">
                            {jobsCount} job{jobsCount > 1 ? "s" : ""}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                {/* Hiring Status */}
                <span
                  className={`hidden sm:inline-block text-[9px] font-medium px-2 py-1 rounded-full border ${
                    person.isHiring
                      ? "bg-green-500/10 text-green-400 border-green-500/30"
                      : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                  }`}
                >
                  {person.isHiring ? "● Hiring" : "○ Not Hiring"}
                </span>

                {/* Message Button */}
                <button
                  onClick={(e) => handleMessage(e, person.userId, person.name, person.profileImage)}
                  className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-black transition-all duration-200 hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/25 group/btn"
                >
                  <MessageCircle size={13} className="transition-transform duration-200 group-hover/btn:scale-110" />
                  <span className="hidden sm:inline">Message</span>
                </button>

                {/* View Profile Icon - Mobile */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProfileClick(person.userId);
                  }}
                  className="sm:hidden p-1.5 rounded-lg border border-slate-700 text-gray-400 hover:text-white hover:border-slate-600 transition-colors"
                >
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {alumni.length > 3 && (
        <div className="mt-3 pt-3 border-t border-[#1e293b]">
          <button
            onClick={() => router.push(`/${userType}/alumni-network`)}
            className="w-full text-center text-xs text-green-400 hover:text-green-300 transition-colors font-medium"
          >
            View all {alumni.length} alumni →
          </button>
        </div>
      )}
    </div>
  );
}