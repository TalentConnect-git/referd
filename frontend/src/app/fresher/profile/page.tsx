"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import {
  Award as AwardIcon,
  Briefcase,
  ExternalLink,
  FileText,
  GraduationCap,
  Globe,
  Loader2,
  Trophy,
  User,
} from "lucide-react";

import ProfileHeader from "@/components/profile/ProfileHeader";
import IdentityCard from "@/components/profile/IdentityCard";
import ProfileSection from "@/components/profile/ProfileSection";
import InfoItem from "@/components/profile/InfoItem";
import TagList from "@/components/profile/TagList";
import Empty from "@/components/profile/Empty";
import Sidebar from "@/components/profile/Sidebar";
import ResumeModal from "@/components/profile/ResumeModal";

import type { ProfileData } from "@/types/profile";

import {
  getInitials,
  formatDateRange,
  getDescription,
  toArray,
} from "@/helper/index";

import { useAuth } from "@/context/AuthContext";

// ---------- Helpers ----------
function hasAwardData(item: any) {
  return Boolean(
    item?.title ||
      item?.organization ||
      item?.startDate ||
      item?.endDate ||
      item?.description,
  );
}

function hasPublicationData(item: any) {
  return Boolean(item?.title || item?.url);
}

function formatMonthYear(value?: string | null) {
  if (!value) return "";

  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-");
    const date = new Date(Number(year), Number(month) - 1);

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }
  }

  return value;
}

function formatAwardDateRange(startDate?: string, endDate?: string) {
  const start = formatMonthYear(startDate);
  const end = formatMonthYear(endDate);

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (end) return end;

  return "";
}

function getSafePublicationUrl(url?: string | null) {
  if (!url) return "";

  const trimmedUrl = url.trim();

  if (!trimmedUrl) return "";

  if (
    trimmedUrl.startsWith("http://") ||
    trimmedUrl.startsWith("https://")
  ) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}

// ---------- Page Component ----------
export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();

  const { profile, profileLoading, refreshProfile } = useAuth();

  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const editHref = `${pathname.replace(/\/profile\/?$/, "")}/edit-option`;

  // Switch to professional account
  const switchToProfessional = async () => {
    if (!profile) return;

    try {
      setSwitching(true);

      const backendUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("token");

      await axios.put(
        `${backendUrl}/api/onboarding/update`,
        { profileType: "professional" },
        {
          withCredentials: true,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
        },
      );

      await refreshProfile();
      router.push("/professional/home");
    } catch (err) {
      console.error("Failed to switch to professional", err);
    } finally {
      setSwitching(false);
    }
  };

  // Derived / computed values
  const computed = useMemo(() => {
    if (!profile) return null;

    const educations = profile.educations || profile.education || [];
    const experiences = profile.experiences || profile.experience || [];

    const fullName = profile.fullName || profile.name || "User";
    const initials = getInitials(fullName);

    const primaryEducation = educations[0];

    const headline = [
      primaryEducation?.degree || profile.profileType || "Candidate",
      primaryEducation?.specialization,
      primaryEducation?.college,
    ]
      .filter(Boolean)
      .join(" · ");

    const currentRoleLine = [
      profile.currentCompany,
      experiences[0]?.role || experiences[0]?.title,
      profile.totalYearsOfExperience
        ? `${profile.totalYearsOfExperience} yrs`
        : "",
    ]
      .filter(Boolean)
      .join(" · ");

    return {
      fullName,
      initials,
      headline,
      currentRoleLine,
      educations,
      experiences,
      gender: profile.gender,
      dob: profile.dob,
      ethnicity: profile.ethnicity,
      maritalStatus: profile.maritalStatus,
      internationalExperience: profile.internationalExperience || [],
      leadership: profile.leadership || [],
      skills: toArray(profile.skills),
      languages: toArray(profile.languagesKnown),
      domains: toArray(profile.domainKnowledge),
      tools: toArray(profile.toolsAndPlatforms),
      awards: (profile.awards || []).filter(hasAwardData),
      publications: (profile.publications || []).filter(hasPublicationData),
    };
  }, [profile]);

  // ---------- Render States ----------
  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f16] text-white">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#38e878]" />
        <span className="text-[#94a3b8]">Loading profile...</span>
      </div>
    );
  }

  if (!profile || !computed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f16] text-white">
        <div className="text-center">
          <p className="text-[#94a3b8]">No profile data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white">
      <ProfileHeader
        editHref={editHref}
        profileType={profile.profileType}
        switching={switching}
        onSwitchToProfessional={switchToProfessional}
      />

      <main className="grid gap-6 px-4 py-7 sm:px-8 xl:grid-cols-[1fr_420px]">
        <section className="space-y-6">
          <IdentityCard
            profile={profile}
            initials={computed.initials}
            headline={computed.headline}
            currentRoleLine={computed.currentRoleLine}
          />

          {/* Personal Details */}
          <ProfileSection title="Personal Details" icon={<User className="h-4 w-4 text-[#38e878]" />}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="Gender" value={computed.gender || "N/A"} />
              <InfoItem label="Date of Birth" value={computed.dob || "N/A"} />
              <InfoItem label="Ethnicity" value={computed.ethnicity || "N/A"} />
              <InfoItem
                label="Marital Status"
                value={computed.maritalStatus || "N/A"}
              />
            </div>
          </ProfileSection>

          {/* Education */}
          <ProfileSection title="Education" icon={<GraduationCap className="h-4 w-4 text-[#38e878]" />}>
            {computed.educations.length ? (
              <div className="space-y-4">
                {computed.educations.map((edu, index) => (
                  <div
                    key={edu._id || index}
                    className="border-b border-[#1a2533] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-[15px] font-semibold text-white">
                          {edu.college || "N/A"}
                        </h3>
                        <p className="mt-1 text-[13px] text-[#38e878]">
                          {[edu.degree, edu.specialization]
                            .filter(Boolean)
                            .join(" · ") || "N/A"}
                        </p>
                      </div>
                      {edu.yearOfGraduation && (
                        <p className="mt-1 text-[13px] text-[#64748b] sm:mt-0">
                          {edu.yearOfGraduation}
                        </p>
                      )}
                    </div>
                    {edu.cgpa && (
                      <p className="mt-1 text-[13px] text-[#64748b]">
                        CGPA: {edu.cgpa}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Empty>No education added</Empty>
            )}
          </ProfileSection>

          {/* Experience */}
          <ProfileSection title="Experience" icon={<Briefcase className="h-4 w-4 text-[#38e878]" />}>
            {computed.experiences.length ? (
              <div className="space-y-4">
                {computed.experiences.map((exp, index) => (
                  <div
                    key={exp._id || index}
                    className="border-b border-[#1a2533] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-[15px] font-semibold text-white">
                          {exp.role || exp.title || "Role"}
                        </h3>
                        <p className="mt-1 text-[14px] text-[#38e878]">
                          {exp.company || exp.organization || "Company"}
                        </p>
                      </div>
                      <p className="mt-1 text-[13px] text-[#64748b] sm:mt-0">
                        {formatDateRange(
                          exp.startDate,
                          exp.endDate,
                          exp.isCurrent,
                        )}
                      </p>
                    </div>

                    {exp.isCurrent && exp.noticePeriod && (
                      <p className="mt-1 text-[12px] text-[#64748b]">
                        Notice Period: {exp.noticePeriod} days
                      </p>
                    )}

                    {getDescription(exp.description) && (
                      <p className="mt-2 text-[13px] leading-6 text-[#94a3b8]">
                        {getDescription(exp.description)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Empty>No experience added</Empty>
            )}
          </ProfileSection>

          {/* International Experience */}
          {computed.internationalExperience.length > 0 && (
            <ProfileSection title="International Experience" icon={<Globe className="h-4 w-4 text-[#38e878]" />}>
              <div className="space-y-4">
                {computed.internationalExperience.map((exp, idx) => (
                  <div
                    key={exp._id || idx}
                    className="border-b border-[#1a2533] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-[15px] font-semibold text-white">
                          {exp.role || "N/A"}
                        </h3>
                        <p className="mt-1 text-[14px] text-[#38e878]">
                          {exp.organization || "N/A"} • {exp.country || "N/A"}
                        </p>
                      </div>
                      <p className="mt-1 text-[13px] text-[#64748b] sm:mt-0">
                        {formatDateRange(exp.startDate, exp.endDate)}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="mt-2 text-[13px] text-[#94a3b8]">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}

          {/* Leadership */}
          {computed.leadership.length > 0 && (
            <ProfileSection title="Leadership" icon={<Trophy className="h-4 w-4 text-[#38e878]" />}>
              <div className="space-y-4">
                {computed.leadership.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="border-b border-[#1a2533] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-[15px] font-semibold text-white">
                          {item.role || "N/A"}
                        </h3>
                        <p className="mt-1 text-[14px] text-[#38e878]">
                          {item.organization || item.company || "N/A"}
                        </p>
                      </div>
                      <p className="mt-1 text-[13px] text-[#64748b] sm:mt-0">
                        {formatDateRange(item.startDate, item.endDate)}
                      </p>
                    </div>
                    {item.description && (
                      <p className="mt-2 text-[13px] text-[#94a3b8]">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}

          {/* Skills */}
          <ProfileSection title="Skills" icon={<AwardIcon className="h-4 w-4 text-[#38e878]" />}>
            {computed.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {computed.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[#12381f] px-3 py-1 text-[13px] text-[#38e878]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <Empty>No skills added</Empty>
            )}
          </ProfileSection>

          {/* Languages */}
          <ProfileSection title="Languages" icon={<Globe className="h-4 w-4 text-[#38e878]" />}>
            {computed.languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {computed.languages.map((language, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[#12381f] px-3 py-1 text-[13px] text-[#38e878]"
                  >
                    {language}
                  </span>
                ))}
              </div>
            ) : (
              <Empty>No languages added</Empty>
            )}
          </ProfileSection>

          {/* Domains */}
          <ProfileSection title="Domains" icon={<Briefcase className="h-4 w-4 text-[#38e878]" />}>
            {computed.domains.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {computed.domains.map((domain, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[#12381f] px-3 py-1 text-[13px] text-[#38e878]"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            ) : (
              <Empty>No domains added</Empty>
            )}
          </ProfileSection>

          {/* Tools */}
          <ProfileSection title="Tools & Platforms" icon={<AwardIcon className="h-4 w-4 text-[#38e878]" />}>
            {computed.tools.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {computed.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[#12381f] px-3 py-1 text-[13px] text-[#38e878]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            ) : (
              <Empty>No tools added</Empty>
            )}
          </ProfileSection>

          {/* About */}
          <ProfileSection title="About" icon={<User className="h-4 w-4 text-[#38e878]" />}>
            <p className="text-[14px] leading-7 text-[#94a3b8]">
              {profile.about || "No about information provided."}
            </p>
          </ProfileSection>

          {/* Achievements */}
          <ProfileSection title="Achievements" icon={<Trophy className="h-4 w-4 text-[#38e878]" />}>
            {profile.achievements?.length ? (
              <div className="space-y-4">
                {profile.achievements.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="border-b border-[#1a2533] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-[15px] font-semibold text-white">
                          {item.title || "Achievement"}
                        </h3>
                        {item.event && (
                          <p className="mt-1 text-[14px] text-[#38e878]">
                            {item.event}
                          </p>
                        )}
                      </div>
                      {item.date && (
                        <p className="mt-1 text-[13px] text-[#64748b] sm:mt-0">
                          {item.date}
                        </p>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-2 text-[13px] text-[#94a3b8]">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Empty>No achievements added</Empty>
            )}
          </ProfileSection>

          {/* Awards */}
          <ProfileSection title="Awards" icon={<AwardIcon className="h-4 w-4 text-[#38e878]" />}>
            {computed.awards.length ? (
              <div className="space-y-4">
                {computed.awards.map((item, index) => {
                  const duration = formatAwardDateRange(
                    item.startDate,
                    item.endDate,
                  );

                  return (
                    <div
                      key={item._id || index}
                      className="border-b border-[#1a2533] pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-[15px] font-semibold text-white">
                            {item.title || "Award"}
                          </h3>
                          {item.organization && (
                            <p className="mt-1 text-[14px] text-[#38e878]">
                              {item.organization}
                            </p>
                          )}
                        </div>
                        {duration && (
                          <p className="mt-1 text-[13px] text-[#64748b] sm:mt-0">
                            {duration}
                          </p>
                        )}
                      </div>
                      {item.description && (
                        <p className="mt-2 whitespace-pre-line text-[13px] leading-6 text-[#94a3b8]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty>No awards added</Empty>
            )}
          </ProfileSection>

          {/* Publications */}
          <ProfileSection title="Publications" icon={<FileText className="h-4 w-4 text-[#38e878]" />}>
            {computed.publications.length ? (
              <div className="space-y-4">
                {computed.publications.map((item, index) => {
                  const safeUrl = getSafePublicationUrl(item.url);

                  return (
                    <div
                      key={item._id || index}
                      className="border-b border-[#1a2533] pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <h3 className="text-[15px] font-semibold text-white">
                          {item.title || "Publication"}
                        </h3>
                        {safeUrl ? (
                          <a
                            href={safeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-2 text-[13px] text-[#38e878] hover:text-[#4af088] transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View Publication
                          </a>
                        ) : (
                          <p className="mt-2 text-[12px] text-[#94a3b8]">
                            Publication link not added.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty>No publications added</Empty>
            )}
          </ProfileSection>
        </section>

        <Sidebar
          profile={profile}
          resumeModalOpen={resumeModalOpen}
          setResumeModalOpen={setResumeModalOpen}
        />
      </main>

      {resumeModalOpen && profile.resume && (
        <ResumeModal
          resumeUrl={profile.resume}
          onClose={() => setResumeModalOpen(false)}
        />
      )}
    </div>
  );
}