"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import AlumniCard from "./AluminiCard";

type CompanyOption = {
  label: string;
  value: string;
};

type Alumni = {
  _id: string;
  name?: string;
  fullName?: string;
  jobRoles?: string[];
  currentCompany?: string;
  company?: string;
  college?: string;
  collegeName?: string;
  referralMetrics?: {
    totalReferralsPosted?: number;
  };
};

type AlumniResult = {
  company: string;
  alumni: Alumni[];
};

export default function DashboardAlumini() {
  const [aluminiResults, setAluminiResults] = useState<AlumniResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchAlumini() {
      try {
        setLoading(true);

        const response = await axiosInstance.get("/dropdown/companiesName");
        console.log("compnies data",response.data)
        const companies: CompanyOption[] = response.data || [];
        
        const results: AlumniResult[] = await Promise.all(
          companies.map(async (company) => {
            try {
              console.log(company.value);
              const res = await axiosInstance.get(
                `/api/candidate/alumni/${company.value}/${""}`
              );

              return {
                company: company.label,
                alumni: res.data?.alumni || [],
              };
            } catch (error) {
              console.error(`Error fetching alumni for ${company.label}:`, error);

              return {
                company: company.label,
                alumni: [],
              };
            }
          })
        );

        if (!isMounted) return;

        setAluminiResults(results);
      } catch (err) {
        console.error("Error fetching aluminis:", err);

        if (!isMounted) return;

        setAluminiResults([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAlumini();

    return () => {
      isMounted = false;
    };
  }, []);

  const allAlumni = aluminiResults.flatMap((companyData) =>
    companyData.alumni.map((alumni) => ({
      ...alumni,
      fallbackCompany: companyData.company,
    }))
  );

  if (loading) {
    return (
      <div className="mt-6 mx-5 rounded-3xl border border-[#1e293b] bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-[#1e293b] p-4">
          <div>
            <div className="h-5 w-48 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-white/10" />
          </div>

          <div className="h-5 w-20 animate-pulse rounded bg-white/10" />
        </div>

        <div className="grid grid-cols-1 gap-6 p-3 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl border border-[#1e293b] bg-[#020617]"
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

        <button className="text-md text-gray-400 hover:text-white">
          View All →
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 p-3 md:grid-cols-2 xl:grid-cols-3">
        {allAlumni.length === 0 ? (
          <p className="col-span-full p-4 text-gray-400">No alumni found</p>
        ) : (
          allAlumni.map((alumni) => (
            <AlumniCard
              key={alumni._id}
              name={alumni.fullName || alumni.name || "Alumni"}
              role={alumni.jobRoles?.[0] || "Professional"}
              company={
                alumni.currentCompany ||
                alumni.company ||
                alumni.fallbackCompany ||
                "Company"
              }
              college={alumni.college || alumni.collegeName || "College"}
              openRoles={alumni.referralMetrics?.totalReferralsPosted || 0}
            />
          ))
        )}
      </div>
    </div>
  );
}