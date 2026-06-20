import {
  AlumniDetailExperienceProps,
} from "@/types/alumni";

export default function AlumniDetailExperience({
  experiences,
}: AlumniDetailExperienceProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6">
      <h2 className="mb-6 text-xl font-semibold text-blue-400">
        Experience
      </h2>

      <div className="space-y-6">
        {experiences?.map((experience) => (
          <div
            key={experience._id}
            className="border-l-2 border-green-500 pl-4"
          >
            <h3 className="text-lg font-semibold text-white">
              {experience.role}
            </h3>

            <p className="text-slate-400">
              {experience.company_display}
            </p>

            <p className="mt-1 text-sm">
                <span className="text-slate-500">
                    {experience.startDate}
                    {" • "}
                    </span>
                    {experience.isCurrent ? (
                        <span className="text-green-400 font-medium">
                            Present
                            </span>
                            ) : (
                            <span className="text-slate-500">
                                {experience.endDate}
                                </span>
                            )}
                            </p>

            {experience.description && (
              <p className="mt-3 text-slate-400">
                {experience.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}