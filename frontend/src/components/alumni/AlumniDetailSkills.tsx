import { AlumniDetailSkillsProps } from "@/types/alumni";

export default function AlumniDetailSkills({
  skills,
  toolsAndPlatforms,
}: AlumniDetailSkillsProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6">
      
      {/* Skills */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-blue-400">
          Skills
        </h2>

        <div className="flex flex-wrap gap-2">
          {skills?.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Tools & Platforms
        </h2>

        <div className="flex flex-wrap gap-2">
          {toolsAndPlatforms?.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-green-700 px-3 py-1 text-sm text-green-400"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}