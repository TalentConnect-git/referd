"use client";

import { ApplicationDetailSkillsProps } from "@/types/applications";

export default function ApplicationDetailSkills({
  skills,
  toolsAndPlatforms,
}: ApplicationDetailSkillsProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-800
        p-6
      "
    >
      <h2 className="text-xl font-semibold mb-6 text-blue-400">
        Skills & Technologies
      </h2>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-slate-400 mb-3">
          Core Skills
        </h3>

        <div className="flex flex-wrap gap-2">
          {skills?.length ? (
            skills.map(
              (skill: string, index: number) => (
                <span
                  key={index}
                  className="
                    px-3
                    py-2
                    rounded-full
                    bg-slate-500/10
                    border
                    border-slate-500/30
                    text-slate-400
                    text-sm
                  "
                >
                  {skill}
                </span>
              )
            )
          ) : (
            <p className="text-slate-500">
              No skills added
            </p>
          )}
        </div>
      </div>

      {/* Tools */}
      <div>
        <h3 className="text-slate-400 mb-3">
          Tools & Platforms
        </h3>

        <div className="flex flex-wrap gap-2">
          {toolsAndPlatforms?.length ? (
            toolsAndPlatforms.map(
              (
                tool: string,
                index: number
              ) => (
                <span
                  key={index}
                  className="
                    px-3
                    py-2
                    rounded-full
                    bg-slate-800
                    border
                    border-slate-700
                    text-slate-300
                    text-sm
                  "
                >
                  {tool}
                </span>
              )
            )
          ) : (
            <p className="text-slate-500">
              No tools added
            </p>
          )}
        </div>
      </div>
    </div>
  );
}