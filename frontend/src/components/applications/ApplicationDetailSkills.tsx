"use client";

import { ApplicationDetailSkillsProps } from "@/types/applications";

export default function ApplicationDetailSkills({
  skills,
  toolsAndPlatforms,
}: ApplicationDetailSkillsProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#2a3a52]
        bg-gradient-to-r from-[#111827] to-[#1a2332]
        p-5
        shadow-xl
        shadow-black/20
        backdrop-blur-sm
      "
    >
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="bg-gradient-to-r from-green-500 to-emerald-600 w-1 h-6 rounded-full"></span>
        Skills & Technologies
      </h2>

      {/* Skills */}
      <div className="mb-4">
        <h3 className="text-xs text-slate-400 font-medium mb-2.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Core Skills
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {skills?.length ? (
            skills.map(
              (skill: string, index: number) => (
                <span
                  key={index}
                  className="
                    px-2.5
                    py-1
                    rounded-full
                    bg-blue-500/10
                    border
                    border-blue-500/20
                    text-blue-400
                    text-xs
                    font-medium
                    transition-all
                    hover:bg-blue-500/20
                    hover:border-blue-500/40
                    hover:scale-105
                    cursor-default
                  "
                >
                  {skill}
                </span>
              )
            )
          ) : (
            <p className="text-xs text-slate-500">
              No skills added
            </p>
          )}
        </div>
      </div>

      {/* Tools & Platforms */}
      <div>
        <h3 className="text-xs text-slate-400 font-medium mb-2.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          Tools & Platforms
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {toolsAndPlatforms?.length ? (
            toolsAndPlatforms.map(
              (
                tool: string,
                index: number
              ) => (
                <span
                  key={index}
                  className="
                    px-2.5
                    py-1
                    rounded-full
                    bg-purple-500/10
                    border
                    border-purple-500/20
                    text-purple-400
                    text-xs
                    font-medium
                    transition-all
                    hover:bg-purple-500/20
                    hover:border-purple-500/40
                    hover:scale-105
                    cursor-default
                  "
                >
                  {tool}
                </span>
              )
            )
          ) : (
            <p className="text-xs text-slate-500">
              No tools added
            </p>
          )}
        </div>
      </div>
    </div>
  );
}