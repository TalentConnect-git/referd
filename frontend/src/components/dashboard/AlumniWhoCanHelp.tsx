"use client";
import { AlumniWhoCanHelpProps,alumniWhoCanHelp } from "@/types/dashboard";
import { getAlumniWhoCanHelp } from "@/services/alumani.services";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


export default function AlumniWhoCanHelp({job}:AlumniWhoCanHelpProps) {
    const [alumni, setAlumni] = useState<alumniWhoCanHelp[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { role: userType } = useAuth();
   useEffect(() => {
  const fetchAlumni = async () => {
    try {
      const company =
        job.candidatePosted?.currentCompany ||
        job.companyName ||
        "";

      const response = await getAlumniWhoCanHelp(
        job._id
      );

      // console.log("Alumni Who Can Help:", response);

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

    if (loading) {
    return <div className="text-white">Loading...</div>;
    }

    if (alumni.length === 0) {

  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">
        Alumni Who Can Help
      </h3>
      <p className="text-gray-400">
        No alumni found for this company.
      </p>
    </div>
  );
}

    return (
<div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">
  <h3 className="mb-5 text-xl font-semibold text-white">
    Alumni Who Can Help
  </h3>

  <div className="space-y-4">
    {alumni.map((person) => {
      const initials =
        person.name?.charAt(0)?.toLowerCase() || "A";

      const jobsCount = person.referralJobs?.length || 0;

      return (
        <div
        onClick={() =>router.push(`/${userType}/alumani-network/${person.userId}`)}
          key={person.userId}
          className="flex items-center justify-between rounded-2xl border border-[#1e293b] bg-[#0f172a] p-5"
        >
          {/* Left */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white">
              {initials}
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white">
                {person.name}
              </h4>

              <p className="mt-2 text-sm text-gray-400">
                {jobsCount > 0
                  ? `${jobsCount} job${jobsCount > 1 ? "s" : ""} available`
                  : "No jobs available"}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end gap-3">
            <span
              className={`rounded-full px-4 py-1 text-sm font-medium ${
                person.isHiring
                  ? "bg-green-900/40 text-green-400"
                  : "bg-slate-700 text-gray-300"
              }`}
            >
              {person.isHiring ? "Hiring" : "Not Hiring"}
            </span>

            <button
              className="rounded-full bg-green-500 px-5 py-2 text-sm font-semibold text-white hover:bg-[#147343]"
            >
              Message
            </button>
          </div>
        </div>
      );
    })}
  </div>
</div>

);
}