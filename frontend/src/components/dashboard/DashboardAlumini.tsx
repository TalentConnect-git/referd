"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlumniCard from "./AluminiCard";
import Link from "next/link";
import { fetchAlumniData } from "@/services/alumani.services";
import { Alumni } from "@/types/dashboard";
import { DashboardAluminiProps } from "@/types/dashboard";
import { Users, ChevronRight, UserCheck, Building2 } from "lucide-react";

export default function DashboardAlumni({ userType }: DashboardAluminiProps) {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        if (userType === "student" || userType === "fresher") {
          const response = await fetchAlumniData("college", 1);
          setAlumni(response.data || []);
        } else {
          const response = await fetchAlumniData("company", 1);
          if ("alumniByCompany" in response) {
            const alumniList = Object.values(response.alumniByCompany).flat();
            setAlumni(alumniList);
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
  }, []);

  console.log("Alumni list is ", alumni);

  const uniqueAlumni = Array.from(
    new Map(alumni.map((item) => [item._id, item])).values(),
  );

  const displayedAlumni = uniqueAlumni.slice(0, 3);
  const hasMore = uniqueAlumni.length > 3;

  if (loading) {
    return (
      <div className="mt-4  rounded-2xl border border-slate-800 bg-[#0f172a] overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <div className="h-5 w-40 animate-pulse rounded bg-slate-700/50" />
            <div className="mt-1.5 h-3.5 w-48 animate-pulse rounded bg-slate-700/50" />
          </div>
          <div className="h-4 w-20 animate-pulse rounded bg-slate-700/50" />
        </div>

        <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl border border-slate-800 bg-slate-800/20"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4  rounded-2xl border border-slate-800 bg-[#0f172a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0f172a]/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
            <UserCheck className="h-3.5 w-3.5 text-blue-400" />
          </div>

          <div>
            <h2 className="text-[13px] font-semibold text-white">
              Alumni Hiring Network
            </h2>
            <p className="text-[10px] text-gray-500">
              {alumni.length} verified alumni currently hiring
            </p>
          </div>
        </div>

        {hasMore && (
          <Link
            href={`${
              userType === "student" || userType === "fresher"
                ? "/student"
                : "/professional"
            }/alumani-network`}
            className="group inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-white transition-colors duration-200"
          >
            View All
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        )}
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 xl:grid-cols-3">
        {displayedAlumni.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-8 px-5">
            <div className="h-12 w-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-sm text-gray-400">No alumni found</p>
            <p className="text-xs text-gray-500 mt-1">
              Check back later for updates
            </p>
          </div>
        ) : (
          displayedAlumni.map((person) => (
            <AlumniCard
              key={person._id}
              name={person.fullName || person.name || "Alumni"}
              role={person.jobRoles?.[0] || "Professional"}
              company={person.currentCompany || "Company"}
              profileImage={person.profileImage}
              college={person.colleges?.[0] || "College"}
              userId={person.userId}
              openRoles={person.referralMetrics?.totalReferralsPosted || 0}
              onClick={() =>
                router.push(`/${userType}/profile/${person.userId}`)
              }
            />
          ))
        )}
      </div>

      {/* Footer - Show only if hasMore */}
      {hasMore && displayedAlumni.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-800/10">
          <Link
            href={`${
              userType === "student" || userType === "fresher"
                ? "/student"
                : "/professional"
            }/alumani-network`}
            className="w-full inline-flex items-center justify-center gap-2 text-[11px] font-medium text-gray-400 hover:text-pink-400 transition-colors duration-200 group"
          >
            <span>View all {alumni.length} alumni</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      )}
    </div>
  );
}
