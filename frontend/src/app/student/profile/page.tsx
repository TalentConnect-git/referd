"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import {
  Award,
  Briefcase,
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
import axiosInstance from '@/lib/axiosInstance';
import type { ProfileData } from "@/types/profile";

import {
  getInitials,
  formatDateRange,
  getDescription,
  toArray,
} from "@/helper/index";

import { getResumePdfViewUrl, getResumeServeUrl } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { getCareerInsights } from "@/services/stats.services";

// ---------- Helper ----------
function getProfileUserId(profile: ProfileData | null) {
  if (!profile) return "";
  return String((profile as any)?.userId || (profile as any)?._id || "");
}

// ---------- Page Component ----------
export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();

  const { profile, profileLoading, refreshProfile } = useAuth();

  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [careerInsightsLoading, setCareerInsightsLoading] = useState(true);
  const [careerInsightsError, setCareerInsightsError] = useState<string | null>(null);

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
    };
  }, [profile]);

  // ---------- Render States ----------

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f16] text-white">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#2fb344]" />
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

  const userId = getProfileUserId(profile);
  const resumePdfUrl = getResumePdfViewUrl(userId);
  const resumeServeUrl = getResumeServeUrl(userId);

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white">
      <ProfileHeader
        editHref={editHref}
        profileType={profile.profileType}
        switching={switching}
        onSwitchToProfessional={switchToProfessional}
      />

      <main className="grid gap-6 px-8 py-7 xl:grid-cols-[1fr_420px]">
        <section className="space-y-6">
          <IdentityCard
            profile={profile}
            initials={computed.initials}
            headline={computed.headline}
            currentRoleLine={computed.currentRoleLine}
          />

          <ProfileSection title="Personal Details" icon={<User />}>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem 
                label="Gender" 
                value={computed.gender || "N/A"} 
              />
              <InfoItem 
                label="Date of Birth" 
                value={computed.dob || "N/A"} 
              />
              <InfoItem 
                label="Ethnicity" 
                value={computed.ethnicity || "N/A"} 
              />
              <InfoItem 
                label="Marital Status" 
                value={computed.maritalStatus || "N/A"} 
              />
            </div>
          </ProfileSection>

          <ProfileSection title="Education" icon={<GraduationCap />}>
            {computed.educations.length ? (
              <div className="space-y-5">
                {computed.educations.map((edu, index) => (
                  <div key={edu._id || index} className="border-b border-[#242d3a] last:border-0 pb-4 last:pb-0">
                    <h3 className="text-[15px] font-bold text-white">
                      {edu.college || "N/A"}
                    </h3>
                    <p className="mt-1 text-[13px] text-[#94a3b8]">
                      {[edu.degree, edu.specialization, edu.yearOfGraduation]
                        .filter(Boolean)
                        .join(" · ") || "N/A"}
                    </p>
                    {edu.cgpa && (
                      <p className="mt-1 text-[13px] text-[#64748b]">
                        CGPA / Percentage: {edu.cgpa}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Empty>No education added</Empty>
            )}
          </ProfileSection>

          <ProfileSection title="Experience" icon={<Briefcase />}>
            {computed.experiences.length ? (
              <div className="space-y-5">
                {computed.experiences.map((exp, index) => (
                  <div key={exp._id || index} className="border-b border-[#242d3a] last:border-0 pb-4 last:pb-0">
                    <h3 className="text-[15px] font-bold text-white">
                      {exp.role || exp.title || "Role"} ·{" "}
                      {exp.company || exp.organization || "Company"}
                    </h3>
                    <p className="mt-1 text-[13px] text-[#94a3b8]">
                      {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                    </p>
                    {exp.isCurrent && exp.noticePeriod && (
                      <p className="text-[12px] text-[#64748b]">
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

          {computed.internationalExperience.length > 0 && (
            <ProfileSection title="International Experience" icon={<Globe />}>
              <div className="space-y-4">
                {computed.internationalExperience.map((exp, idx) => (
                  <div key={exp._id || idx} className="border-b border-[#242d3a] last:border-0 pb-4 last:pb-0">
                    <h3 className="text-[15px] font-bold text-white">
                      {exp.organization || "N/A"} – {exp.role || "N/A"}
                    </h3>
                    <p className="text-[13px] text-[#94a3b8]">
                      {exp.country || "N/A"} ·{" "}
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </p>
                    {exp.description && (
                      <p className="mt-1 text-[13px] text-[#94a3b8]">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}

          {computed.leadership.length > 0 && (
            <ProfileSection title="Leadership" icon={<Trophy />}>
              <div className="space-y-4">
                {computed.leadership.map((item, idx) => (
                  <div key={item._id || idx} className="border-b border-[#242d3a] last:border-0 pb-4 last:pb-0">
                    <h3 className="text-[15px] font-bold text-white">
                      {item.role || "N/A"} at {item.organization || item.company || "N/A"}
                    </h3>
                    <p className="text-[13px] text-[#94a3b8]">
                      {formatDateRange(item.startDate, item.endDate)}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-[13px] text-[#94a3b8]">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}

          <ProfileSection title="Skills" icon={<Award />}>
            {computed.skills.length > 0 ? (
              <TagList items={computed.skills} />
            ) : (
              <Empty>No skills added</Empty>
            )}
          </ProfileSection>

          <ProfileSection title="Languages" icon={<Globe />}>
            {computed.languages.length > 0 ? (
              <TagList items={computed.languages} />
            ) : (
              <Empty>No languages added</Empty>
            )}
          </ProfileSection>

          <ProfileSection title="Domains" icon={<Briefcase />}>
            {computed.domains.length > 0 ? (
              <TagList items={computed.domains} />
            ) : (
              <Empty>No domains added</Empty>
            )}
          </ProfileSection>

          <ProfileSection title="Tools & Platforms" icon={<Award />}>
            {computed.tools.length > 0 ? (
              <TagList items={computed.tools} />
            ) : (
              <Empty>No tools added</Empty>
            )}
          </ProfileSection>

          <ProfileSection title="About" icon={<User />}>
            <p className="text-[14px] leading-7 text-[#94a3b8]">
              {profile.about || "No about information provided."}
            </p>
          </ProfileSection>

          <ProfileSection title="Achievements" icon={<Trophy />}>
            {profile.achievements?.length ? (
              <div className="space-y-4">
                {profile.achievements.map((item, index) => (
                  <div key={item._id || index} className="border-b border-[#242d3a] last:border-0 pb-4 last:pb-0">
                    <h3 className="text-[15px] font-bold text-white">
                      {item.title || "Achievement"}
                    </h3>
                    <p className="mt-1 text-[13px] text-[#94a3b8]">
                      {[item.event, item.date].filter(Boolean).join(" · ") || "N/A"}
                    </p>
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