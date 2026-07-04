import { OverviewSectionProps } from "@/types/dashboard";
import { applyJob } from "@/services/job.service";
import PostedByReferrer from "./PostedByReferrer";
import AlumniWhoCanHelp from "./AlumniWhoCanHelp";
export default function OverviewSection({ job }: OverviewSectionProps) {
console.log("Received Job ",job);


  
//   const handleApply = async () => {
//   try {
//     console.log(job);
//   console.log(
//   job._id,
//   job.jobType,
//   job.matchScore
// );
//     await applyJob(
//       job._id,
//       job.jobType,
//       job.matchScore || 0
//     );
//     alert("Applied successfully");
//   } catch (err) {
//     console.error("Error applying:", err);
//   }

// };
    return(
        <>
        <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">

              <h3 className="mb-6 text-xl font-semibold text-white">
                Job Details
              </h3>

              <div className="grid grid-cols-2 gap-8">

                <div>
                  <p className="text-sm text-blue-400">
                    Job Role
                  </p>
                  <p className="mt-1 text-white">
                    {job.jobTitle || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-blue-400">
                    Employment Type
                  </p>
                  <p className="mt-1 text-white">
                    {job.employmentType?.[0] || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-blue-400">
                    Work Location
                  </p>
                  <p className="mt-1 text-white">
                    {job.location?.[0] || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-blue-400">
                    Work Mode
                  </p>
                  <p className="mt-1 text-white">
                    {job.workMode?.[0] || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-blue-400">
                    Experience Required
                  </p>
                  <p className="mt-1 text-white">
                    {job.internshipDuration ||
                      job.yearsOfExperience ||
                      "Entry Level"}
                  </p>
                </div>

               {job.jobType != "Referral" &&  <div>
                  <p className="text-sm text-blue-400">
                    CGPA Required
                  </p>
                  <p className="mt-1 text-white">
                    {job.cgpa || "N/A"}
                  </p>
                </div>}


                <div>
                  <p className="text-sm text-blue-400">
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


            {job.candidatePosted && <div className="mt-5 mb-5 rounded-xl border border-[#1e293b] bg-[#111827] p-6">
               <PostedByReferrer candidateId={job.candidatePosted.userId} />
            </div>}

            <div className="mt-5 rounded-xl border border-[#1e293b] bg-[#111827] p-6">
              <AlumniWhoCanHelp job={job} />
            </div>

            {/* Apply Button */}
            {/* <div className="mt-8 flex justify-center">

              <button  onClick={handleApply} className="rounded-lg bg-green-500 px-10 py-3 font-semibold text-black hover:bg-green-400">
                Apply Now
              </button>

            </div> */}

        </>
    )
}





