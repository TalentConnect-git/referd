
interface OverviewSectionProps {
  job: any;
}

import { applyJob } from "@/services/job.service";
export default function OverviewSection({ job }: OverviewSectionProps) {
  const handleApply = async () => {
  try {
    console.log(job);
console.log(
  job._id,
  job.jobType,
  job.matchScore
);
    await applyJob(

      job._id,
      job.jobType,
      job.matchScore || 0
    );
    alert("Applied successfully");
  } catch (err) {
    console.error("Error applying:", err);
  }

};
    return(
        <>
        <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">

              <h3 className="mb-6 text-xl font-semibold text-white">
                Job Details
              </h3>

              <div className="grid grid-cols-2 gap-8">

                <div>
                  <p className="text-sm text-green-500">
                    Job Role
                  </p>
                  <p className="mt-1 text-white">
                    {job.jobRoles?.[0] || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-green-500">
                    Employment Type
                  </p>
                  <p className="mt-1 text-white">
                    {job.employmentType?.[0] || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-green-500">
                    Work Location
                  </p>
                  <p className="mt-1 text-white">
                    {job.location?.[0] || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-green-500">
                    Work Mode
                  </p>
                  <p className="mt-1 text-white">
                    {job.workMode?.[0] || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-green-500">
                    Duration / Experience
                  </p>
                  <p className="mt-1 text-white">
                    {job.internshipDuration ||
                      job.yearsOfExperience ||
                      "Entry Level"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-green-500">
                    CGPA Required
                  </p>
                  <p className="mt-1 text-white">
                    {job.cgpa || "N/A"}
                  </p>
                </div>


                <div>
                  <p className="text-sm text-green-500">
                    Package
                  </p>
                  <p className="mt-1 text-white">
                    ₹ {job.packageDetails?.totalCTC || "N/A"}
                  </p>
                </div>

              </div>
            </div>

            

            {/* Description */}
            <div className="mt-6 rounded-xl border border-[#1e293b] bg-[#111827] p-6">

              <h3 className="mb-4 text-xl font-semibold text-white">
                Job Description
              </h3>

              <p className="leading-7 text-gray-300">
                {job.description || "No description provided"}
              </p>

            </div>

            {/* Apply Button */}
            <div className="mt-8 flex justify-center">

              <button  onClick={handleApply} className="rounded-lg bg-green-500 px-10 py-3 font-semibold text-black hover:bg-green-400">
                Apply Now
              </button>

            </div>

        </>
    )
}