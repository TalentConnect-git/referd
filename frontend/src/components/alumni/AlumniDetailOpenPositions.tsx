import { BriefcaseBusiness, Calendar } from "lucide-react";
import { AlumniDetailOpenPositionsProps } from "@/types/alumni";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AlumniDetailOpenPositions({
  userProfile,
}: AlumniDetailOpenPositionsProps) {
  const jobs = userProfile.referralJobs || [];
  const router = useRouter();
  const { profile, user } = useAuth();
  const userType =
  profile?.profileType ||
  user?.userType ||
  "student";
  const getJobRoute = (jobType: string) => {
  switch (jobType?.toLowerCase()) {
    case "referral":
    case "referral jobs":
      return "referral-jobs";

    case "off-campus":
    case "off campus":
      return "offcampus";

    case "internship":
    case "internships":
      return "internships";

    default:
      return "offcampus";
  }
};

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
        <BriefcaseBusiness size={22} />
        Open Positions
      </h2>

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="rounded-xl border border-[var(--border)] p-4"
              onClick={() => {
                router.push(`/${userType}/jobs/${getJobRoute(job.jobType)}/${job._id}`);
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {job.jobTitle?.join(", ") || "Untitled Position"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                    {job.description || "No description available"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    job.jobStatus === "Approved"
                      ? "bg-green-500/15 text-green-400"
                      : "bg-yellow-500/15 text-yellow-400"
                  }`}
                >
                  {job.jobStatus}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                <Calendar size={15} />
                Posted{" "}
                {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--border)] py-10 text-center">
          <BriefcaseBusiness
            size={36}
            className="mx-auto mb-3 text-gray-500"
          />

          <p className="text-gray-400">
            No open positions available.
          </p>
        </div>
      )}
    </div>
  );
}