// components/profile/ProfileContainer.tsx
"use client";

import CandidateHeader from "./CandidateHeader";
import PersonalInformation from "./PersonalInfo";
import EducationCard from "./EducatonCard";
import ExperienceCard from "./ExperienceCard";
import NoticePeriodCard from "./NoticePeriod";
import JobPreferencesCard from "./JobPreferencesCard";
import AboutCard from "./AboutCard";
import SkillsCard from "./SkillsCard";
import AchievementCard from "./AchievementCard";
import AwardCard from "./AwardCard";
import PublicationCard from "./PublicationCard";
import LeadershipCard from "./LeadershipCard";
import ContactCard from "./ContactCard";
import InternationalExperienceCard from "./InternationalExperienceCard";

import { ProfileData } from "@/types/profile";

interface ProfileContainerProps {
  profile: ProfileData;
}

export default function ProfileContainer({ profile }: ProfileContainerProps) {
  return (
    <div className="min-h-screen bg-[#02070b] text-[#cbd5e1]">
      <main className="mx-auto w-full max-w-[920px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-5">
          {/* Full Width Header */}
          <CandidateHeader profile={profile} />

          {/* Row: About + Education (flex row) */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <AboutCard profile={profile} />
            <EducationCard profile={profile} />
          </div>

          {/* Row: Experience + International Experience */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ExperienceCard profile={profile} />
            <InternationalExperienceCard profile={profile} />
          </div>

          {/* Row: Achievement + Awards */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <AchievementCard profile={profile} />
            <AwardCard profile={profile} />
          </div>

          {/* Row: Publications + Leadership */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <PublicationCard profile={profile} />
            <LeadershipCard profile={profile} />
          </div>

          {/* Row: Skills + Job Preferences */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <SkillsCard profile={profile} />
            <JobPreferencesCard profile={profile} />
          </div>

          {/* Full Width Notice Period */}

          {/* Row: Personal Information + Contact (flex row) - LAST */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <NoticePeriodCard profile={profile} />
            <PersonalInformation profile={profile} />
          </div>
        </div>
      </main>
    </div>
  );
}
