"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlumniCard from "./AluminiCard";
import Link from "next/link";
import { fetchAlumniData } from "@/services/alumani.services";
import { Alumni } from "@/types/dashboard";
import { DashboardAluminiProps } from "@/types/dashboard";
import { Briefcase, Users, ArrowRight, Building2, GraduationCap } from "lucide-react";

export default function DashboardAlumni({userType}:DashboardAluminiProps) {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        if (userType === "student" || userType === "fresher") {
          const response = await fetchAlumniData("college", 1);
          setAlumni(response.data?.slice(0, 3) || []);
        } else {
          const response = await fetchAlumniData("company", 1);
          if ("alumniByCompany" in response) {
            const alumniList = Object.values(response.alumniByCompany).flat();
            setAlumni(alumniList.slice(0, 3));
          }
        }
      } catch (error) {
        console.error("Error fetching alumni:", error);
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [userType]);

  if (loading) {
    return (
      <div className="mt-6 mx-5 rounded-3xl border border-[#1e293b] bg-gradient-to-br from-[#0f172a] to-[#0a0f1f]">
        <div className="flex items-center justify-between border-b border-[#1e293b] p-6">
          <div>
            <div className="h-6 w-56 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-white/10" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded-full bg-white/10" />
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-56 animate-pulse rounded-2xl border border-[#1e293b] bg-[#0a0f1f]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 mx-5 rounded-3xl border border-[#1e293b] bg-gradient-to-br from-[#0f172a] to-[#0a0f1f] shadow-xl shadow-black/20 transition-all hover:border-[#2d3748]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#1e293b] p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3 border border-[#1e293b]">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Alumni Hiring Network
            </h2>
            <p className="mt-1 text-sm text-gray-400 flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500/70 animate-pulse" />
              {alumni.length} verified alumni currently hiring
            </p>
          </div>
        </div>

        <Link 
          href={`${userType === "student" || userType === "fresher" ? "/student" : "/professional"}/alumani-network`} 
          className="mt-3 sm:mt-0 group flex items-center gap-2 rounded-full border border-[#1e293b] bg-[#0f172a]/50 px-4 py-2 text-sm text-gray-400 transition-all hover:border-[#2d3748] hover:bg-[#1a2332] hover:text-white"
        >
          View All
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
        {alumni.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-[#1e293b]/50 p-4 mb-4">
              <Users className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-gray-400 font-medium">No alumni found</p>
            <p className="text-sm text-gray-500 mt-1">Check back later for updates</p>
          </div>
        ) : (
          alumni.map((person) => (
            <div 
              key={person._id}
              className="group relative transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              
              <AlumniCard
                name={person.fullName || person.name || "Alumni"}
                role={person.jobRoles?.[0] || "Professional"}
                company={person.currentCompany || "Company"}
                profileImage={person.profileImage}
                college={person.colleges?.[0] || "College"}
                userId={person.userId}
                openRoles={person.referralMetrics?.totalReferralsPosted || 0}
                onClick={() => router.push(`/${userType}/alumani-network/${person.userId}`)}
              />
            </div>
          ))
        )}
      </div>

      {/* Footer Stats - Only show if there are alumni */}
      {alumni.length > 0 && (
        <div className="border-t border-[#1e293b] px-6 py-4 bg-[#0a0f1f]/50 rounded-b-3xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Briefcase className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-white">
                  {alumni.reduce((acc, curr) => acc + (curr.referralMetrics?.totalReferralsPosted || 0), 0)}
                </span>
                <span>open positions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Building2 className="h-4 w-4 text-purple-400" />
                <span className="font-medium text-white">
                  {new Set(alumni.map(a => a.currentCompany)).size}
                </span>
                <span>companies</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <GraduationCap className="h-4 w-4 text-green-400" />
                <span className="font-medium text-white">
                  {new Set(alumni.map(a => a.colleges?.[0])).size}
                </span>
                <span>colleges</span>
              </div>
            </div>
            <div className="flex -space-x-2">
              {alumni.slice(0, 5).map((person, index) => (
                <div 
                  key={person._id}
                  className="h-8 w-8 rounded-full border-2 border-[#0f172a] bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xs font-medium text-white"
                  style={{ 
                    backgroundImage: person.profileImage ? `url(${person.profileImage})` : undefined,
                    backgroundSize: 'cover'
                  }}
                >
                  {!person.profileImage && (person.fullName?.[0] || person.name?.[0] || 'A')}
                </div>
              ))}
              {alumni.length > 5 && (
                <div className="h-8 w-8 rounded-full border-2 border-[#0f172a] bg-[#1e293b] flex items-center justify-center text-xs font-medium text-gray-400">
                  +{alumni.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}