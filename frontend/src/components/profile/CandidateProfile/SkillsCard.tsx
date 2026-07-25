"use client";

import { Code2 } from "lucide-react";
import { ProfileData } from "@/types/profile";

interface SkillsCardProps {
  profile: ProfileData;
}

const toStringList = (value: unknown): string[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item) return "";

        if (typeof item === "string") return item.trim();

        if (typeof item === "object") {
          const obj = item as {
            name?: string;
            title?: string;
            label?: string;
            value?: string;
            skill?: string;
          };

          return (
            obj.name ||
            obj.title ||
            obj.label ||
            obj.value ||
            obj.skill ||
            ""
          ).trim();
        }

        return String(item).trim();
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const SkillPill = ({ label }: { label: string }) => {
  return (
    <span className="inline-flex h-[27px] items-center rounded-full bg-[var(--background-soft)] px-3 text-[11px] font-black leading-none text-[var(--text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      {label}
    </span>
  );
};

const SkillSection = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
        {title}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => <SkillPill key={`${title}-${item}`} label={item} />)
        ) : (
          <SkillPill label="-" />
        )}
      </div>
    </div>
  );
};

export default function SkillsCard({ profile }: SkillsCardProps) {
  const technicalSkills = toStringList(profile.skills);
  const domainKnowledge = toStringList(profile.domainKnowledge);
  const industries = toStringList(profile.industry);
  const languages = toStringList(profile.languagesKnown);
  const toolsAndPlatforms = toStringList(profile.toolsAndPlatforms);

  return (
    <section className="surface-card rounded-[18px] border border-[var(--border)] bg-[var(--card)] p-[18px] shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)]">
          <Code2 className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-sm font-black text-[var(--text-primary)]">
          Skills &amp; Expertise
        </h2>
      </div>

      <div className="mt-[18px] border-t border-[var(--border)]" />

      <div className="mt-[17px] grid grid-cols-1 gap-x-14 gap-y-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-[18px]">
          <SkillSection title="TECHNICAL SKILLS" items={technicalSkills} />
          <SkillSection title="INDUSTRIES" items={industries} />
          {/* <SkillSection title="LANGUAGES" items={languages} /> */}
        </div>

        {/* Right Column */}
        <div className="space-y-[18px]">
          <SkillSection title="DOMAIN KNOWLEDGE" items={domainKnowledge} />
          <SkillSection title="TOOLS & PLATFORMS" items={toolsAndPlatforms} />
        </div>
      </div>
    </section>
  );
}