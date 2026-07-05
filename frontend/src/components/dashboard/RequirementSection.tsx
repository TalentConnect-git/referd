import { RequirementSectionProps } from "@/types/dashboard";
export default function RequirementSection({ job }: RequirementSectionProps) {
  return (
    <>
    <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">

      <h3 className="mb-6 text-xl font-semibold text-white">
        Eligibility Criteria
      </h3>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <p className="text-sm text-blue-400">
            Minimum Education
          </p>

          <p className="text-white">
            {job.minEducation || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-sm text-blue-400">
            Experience Level
          </p>

          <p className="text-white">
            {job.yearsOfExperience || "Entry Level"}
          </p>
        </div>

        <div>
          <p className="text-sm text-blue-400">
            Eligible Streams
          </p>

          <p className="text-white">
            {job.studentStreams?.join(", ") || "N/A"}
          </p>
        </div>

        {job.jobType !="Referral" && <div>
          <p className="text-sm text-blue-400">
            CGPA Requirement
          </p>

          <p className="text-white">
            {job.cgpa || "-"} 
          </p>
        </div>}

        <div>
          <p className="text-sm text-blue-400">
            Skills Required
          </p>

            <p className="text-white">
              {job.skills?.length ? job.skills.join(", ") : "N/A"}
            </p>
        </div>

      </div>

      <div className="mt-6">
        <p className="text-sm text-blue-400">
          Additional Criteria
        </p>

        <p className="text-white">
          {job.eligibilityCriteria || "N/A"}
        </p>
      </div>

    </div>
    </>

  );
   
}