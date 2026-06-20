import {AlumniDetailEducationProps} from "@/types/alumni";

export default function AlumniDetailEducation({
  educations,
}: AlumniDetailEducationProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6">
      <h2 className="mb-6 text-xl font-semibold text-blue-400">
        Education
      </h2>

      <div className="space-y-5">
        {educations?.map((education) => (
          <div
            key={education._id}
            className="rounded-xl border border-slate-700 p-4"
          >
            <h3 className="text-lg font-semibold text-white">
              {education.college}
            </h3>

            <p className="mt-1 text-slate-300">
              {education.degree} •{" "}
              {education.specialization}
            </p>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">
              <span>
                CGPA: {education.cgpa}
              </span>

              <span>
                Graduation: {education.yearOfGraduation}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}