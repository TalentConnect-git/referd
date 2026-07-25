"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlumniCard from "./AluminiCard";
import Link from "next/link";
import { Alumni } from "@/types/dashboard";
import { DashboardAluminiProps } from "@/types/dashboard";
import { Users, ChevronRight, UserCheck, Building2, UsersRound } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

export default function DashboardAlumni({ userType }: DashboardAluminiProps) {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/candidate/hiring-network",
        );
        
        // Handle different response structures
        let alumniData = [];
        if (response.data?.data) {
          alumniData = response.data.data;
        } else if (Array.isArray(response.data)) {
          alumniData = response.data;
        } else if (response.data?.alumni) {
          alumniData = response.data.alumni;
        } else {
          alumniData = [];
        }
        
        setAlumni(alumniData);

        console.log("alumnilist",alumniData);
      } catch (error) {
        console.error("Error fetching alumni:", error);
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // Remove duplicates based on _id
  const uniqueAlumni = Array.from(
    new Map(alumni.map((item) => [item._id, item])).values(),
  );

  // Get first 3 alumni
  const displayedAlumni = uniqueAlumni.slice(0, 3);
  const hasMore = uniqueAlumni.length > 3;
  const totalCount = uniqueAlumni.length;

  if (loading) {
    return (
      <div className="surface-card mt-4 overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <div>
            <div className="h-5 w-40 animate-pulse rounded bg-[var(--shimmer-start)]" />
            <div className="mt-1.5 h-3.5 w-48 animate-pulse rounded bg-[var(--shimmer-start)]" />
          </div>
          <div className="h-4 w-20 animate-pulse rounded bg-[var(--shimmer-start)]" />
        </div>

        <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="skeleton h-32 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card mt-4 overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--background-soft)]/50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--info-border)] bg-[var(--info-soft)]">
            <UserCheck className="h-3.5 w-3.5 text-[var(--info)]" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Alumni Network
            </h2>
            <p className="text-[10px] text-[var(--text-muted)]">
              {totalCount > 0 ? `${totalCount} verified alumni` : 'No alumni found'}
            </p>
          </div>
        </div>

        {/* View All - Always visible */}
        <Link
          href={`${
            userType === "student" || userType === "fresher"
              ? "/student"
              : "/professional"
          }/alumani-network`}
          className="group inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text-primary)]"
        >
          View All
          <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 xl:grid-cols-3">
        {displayedAlumni.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center px-5 py-8">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-soft)]">
              <UsersRound className="h-6 w-6 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">No alumni found</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
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
              college={person.colleges?.[0]  || "College"}
              userId={person.userId}
              openRoles={person.referralMetrics?.totalReferralsPosted || 0}
              onClick={() =>
                router.push(`/${userType}/profile/${person.userId}`)
              }
            />
          ))
        )}
      </div>

      {/* Footer - Show View All again if there are more than 3 */}
      {totalCount > 3 && displayedAlumni.length > 0 && (
        <div className="border-t border-[var(--border)] bg-[var(--background-soft)]/30 px-4 py-2.5">
          <Link
            href={`${
              userType === "student" || userType === "fresher"
                ? "/student"
                : "/professional"
            }/alumani-network`}
            className="group inline-flex w-full items-center justify-center gap-2 text-[11px] font-medium text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--info)]"
          >
            <UsersRound className="h-3.5 w-3.5" />
            <span>View all {totalCount} alumni</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
    </div>
  );
}