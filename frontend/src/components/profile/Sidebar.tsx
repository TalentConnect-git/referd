"use client";

import {
  Trophy,
  CheckCircle2,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import SideCard from "./SideCard";
import MiniStat from "./MiniStat";
import ConnectedItem from "./ConnectedItem";
import Info from "./Info";
import SmallTagBlock from "./SmallTagBlock";
import Empty from "./Empty";
import LinkedinIcon from "./LinkedinIcon";
import GithubIcon from "./GithubIcon";

import type { ProfileData } from "@/types/profile";
import { toArray } from "@/helper/index";

interface SidebarProps {
  profile: ProfileData;
  resumeModalOpen: boolean;
  setResumeModalOpen: (open: boolean) => void;
}

function getResumeFileName(profile: ProfileData): string {
  const rawName =
    profile.resume?.split("/").pop()?.split("?")[0] ||
    `resume_${profile._id || profile.userId || Date.now()}`;

  const cleanName = rawName
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]/g, "_");

  return cleanName.toLowerCase().endsWith(".pdf")
    ? cleanName
    : `${cleanName}.pdf`;
}

export default function Sidebar({
  profile,
  setResumeModalOpen,
}: SidebarProps) {
  const resumeUrl = profile.resume;
  const hasResume = Boolean(resumeUrl);

  const data = {
    locations: toArray(profile.locations),
    jobRoles: toArray(profile.jobRoles),
    lookingFor: toArray(profile.lookingFor),
    employmentTypes: toArray(profile.employmentType),
    tools: toArray(profile.toolsAndPlatforms),
    domains: toArray(profile.domainKnowledge),
    languages: toArray(profile.languagesKnown),
  };

  const handleViewResume = (): void => {
    if (!resumeUrl) {
      alert("Resume URL not found");
      return;
    }

    setResumeModalOpen(true);
  };

  const handleDownloadResume = async (): Promise<void> => {
    if (!resumeUrl) {
      alert("Resume URL not found");
      return;
    }

    try {
      const response = await fetch(resumeUrl);

      if (!response.ok) {
        throw new Error("Failed to download resume");
      }

      const blob = await response.blob();

      const pdfBlob =
        blob.type === "application/pdf"
          ? blob
          : new Blob([blob], { type: "application/pdf" });

      const blobUrl = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = getResumeFileName(profile);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Resume download failed:", error);

      // fallback: open in new tab if direct download blocked
      window.open(resumeUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <aside className="space-y-6">
      <SideCard title="Referral success score">
        <div className="text-[34px] font-bold text-white">
          8.4 <span className="text-sm text-[var(--primary)]">/ 10</span>
        </div>

        <p className="mt-1 text-[13px] text-[var(--text-primary)]">
          Top 15% on Referd
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <MiniStat icon={<Trophy />} label="12 referrals" />
          <MiniStat icon={<CheckCircle2 />} label="7 hired" />
        </div>
      </SideCard>

      <SideCard title="Documents">
        {hasResume && resumeUrl ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleViewResume}
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition hover:border-[var(--primary)]"
            >
              <FileText className="h-5 w-5 text-[var(--primary)]" />

              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-white">
                  View Resume
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Click to preview PDF
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDownloadResume}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] py-3 text-[13px] font-bold text-white transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              <Download className="h-4 w-4" />
              Download Resume PDF
            </button>
          </div>
        ) : (
          <Empty>No resume uploaded</Empty>
        )}
      </SideCard>

      <SideCard title="Connected">
        <div className="space-y-4">
          <ConnectedItem icon={<Mail />} value={profile.email} />
          <ConnectedItem icon={<Phone />} value={profile.phone} />
          <ConnectedItem icon={<LinkedinIcon />} value={profile.linkedin} />
          <ConnectedItem icon={<GithubIcon />} value={profile.github} />
          <ConnectedItem icon={<MapPin />} value={data.locations.join(", ")} />
        </div>
      </SideCard>

      <SideCard title="Career details">
        <Info label="Current Company" value={profile.currentCompany} />
        <Info label="Company Email" value={profile.companyEmail} />
        <Info label="Total Experience" value={profile.totalYearsOfExperience} />
        <Info label="Notice Period" value={profile.noticePeriod} />
        <Info label="Open To Shift" value={profile.openToShift} />
      </SideCard>

      <SideCard title="Job preferences">
        <SmallTagBlock title="Roles" items={data.jobRoles} />
        <SmallTagBlock title="Looking for" items={data.lookingFor} />
        <SmallTagBlock title="Employment" items={data.employmentTypes} />
      </SideCard>

      <SideCard title="Tools & languages">
        <SmallTagBlock title="Tools" items={data.tools} />
        <SmallTagBlock title="Domains" items={data.domains} />
        <SmallTagBlock title="Languages" items={data.languages} />
      </SideCard>
    </aside>
  );
}