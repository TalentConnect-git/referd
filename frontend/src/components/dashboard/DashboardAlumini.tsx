"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlumniCard from "./AluminiCard";
import Link from "next/link";
import { fetchAlumniData } from "@/services/alumani.services";
import { Alumni } from "@/types/dashboard";
import { DashboardAluminiProps } from "@/types/dashboard";

export default function DashboardAlumni({userType}:DashboardAluminiProps) {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        

      if (userType === "student" || userType === "fresher") {
      const response = await fetchAlumniData(
        "college",1
        );
      setAlumni(response.data || []);
      } else {
        const response = await fetchAlumniData(
        "company",1
        );
        // const alumniList = Object.values(response.alumniByCompany || {}).flat();
        // setAlumni(alumniList);}
        if ("alumniByCompany" in response) {
        const alumniList = Object.values(response.alumniByCompany).flat();
        setAlumni(alumniList);
        }
  
       
      } }catch (error) {
        console.error("Error fetching alumini:", error);
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 mx-5 rounded-3xl border border-[#1e293b] bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-[#1e293b] p-4">
          <div>
            <div className="h-5 w-48 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-white/10" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-3 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl border border-[#1e293b] bg-[#020617]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 mx-5 rounded-3xl border border-[#1e293b] bg-[#0f172a]">
      <div className="flex items-center justify-between border-b border-[#1e293b] p-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Alumni Hiring Network
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Verified alumni currently hiring
          </p>
        </div>

        <Link href={`${
         userType === "student" || userType === "fresher"? "/student": "/professional"}/alumani-network`} className="text-sm text-gray-400 hover:text-white">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 p-3 md:grid-cols-2 xl:grid-cols-3">
        {alumni.length === 0 ? (
          <p className="col-span-full p-4 text-gray-400">
            No alumni found
          </p>
        ) : (
          alumni.map((person) => (
            <AlumniCard
              key={person._id}
              name={person.fullName || person.name || "Alumni"}
              role={person.jobRoles?.[0] || "Professional"}
              company={person.currentCompany || "Company"}
              college={person.college || "College"}
              userId={person.userId}
              openRoles={
                person.referralMetrics?.totalReferralsPosted || 0
              }
              onClick={() =>router.push(`/${userType}/alumani-network/${person.userId}`)}
            />
          ))
        )}
      </div>
      <div>
        
      </div>
    </div>
  );
}