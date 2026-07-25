"use client";

import { ApplicationDetailSkillsProps } from "@/types/applications";

export default function ApplicationDetailSkills({
  skills,
  toolsAndPlatforms,
}: ApplicationDetailSkillsProps) {
  return (
    <div
      className="
        card
        rounded-2xl
        border
        border-theme
        bg-gradient-to-r from-card to-card-soft
        p-5
        shadow-xl
        shadow-black/20
        backdrop-blur-sm
      "
    >
      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <span className="bg-gradient-to-r from-primary to-primary-light w-1 h-6 rounded-full"></span>
        Skills & Technologies
      </h2>

      {/* Skills */}
      <div className="mb-4">
        <h3 className="text-xs text-muted font-medium mb-2.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-info"></span>
          Core Skills
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {skills?.length ? (
            skills.map(
              (skill: string, index: number) => (
                <span
                  key={index}
                  className="
                    badge
                    badge-info
                    px-2.5
                    py-1
                    rounded-full
                    border
                    border-info/20
                    text-info
                    text-xs
                    font-medium
                    transition-all
                    hover:bg-info-soft
                    hover:border-info/40
                    hover:scale-105
                    cursor-default
                  "
                >
                  {skill}
                </span>
              )
            )
          ) : (
            <p className="text-xs text-muted">
              No skills added
            </p>
          )}
        </div>
      </div>

      {/* Tools & Platforms */}
      <div>
        <h3 className="text-xs text-muted font-medium mb-2.5 flex items-center gap-2">
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
                    badge
                    px-2.5
                    py-1
                    rounded-full
                    border
                    border-purple-500/20
                    text-purple-400
                    bg-purple-500/10
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
            <p className="text-xs text-muted">
              No tools added
            </p>
          )}
        </div>
      </div>
    </div>
  );
}