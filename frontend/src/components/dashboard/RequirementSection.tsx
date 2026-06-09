interface RequirementSectionProps {
  job: any;
}



export default function RequirementSection({ job }: RequirementSectionProps) {
  return (
    <>
    <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">

      <h3 className="mb-6 text-xl font-semibold text-white">
        Eligibility Criteria
      </h3>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <p className="text-sm text-green-400">
            Eligible Degrees
          </p>

          <p className="text-white">
            {job.degree?.join(", ") || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-sm text-green-500">
            Experience Level
          </p>

          <p className="text-white">
            {job.yearsOfExperience || "Entry Level"}
          </p>
        </div>

        <div>
          <p className="text-sm text-green-500">
            Eligible Streams
          </p>

          <p className="text-white">
            {job.studentStreams?.join(", ") || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-sm text-green-500">
            CGPA Requirement
          </p>

          <p className="text-white">
            {job.cgpa || "N/A"} CGPA
          </p>
        </div>

      </div>

      <div className="mt-6">
        <p className="text-sm text-green-500">
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