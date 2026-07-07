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
import AchievementsCard from "./AchievementsCard";
import ContactCard from "./ContactCard";

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

          {/* Row 1: Notice Period + Experience */}
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_0.8fr]">
            <NoticePeriodCard profile={profile} />
            <ExperienceCard profile={profile} />
          </section>

          {/* Row 2: About + Contact */}
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_0.8fr]">
            <AboutCard profile={profile} />
            <ContactCard profile={profile} />
          </section>

          {/* Row 3: Achievements / International / Awards / Publications */}
          <AchievementsCard profile={profile} />

          {/* Full Width Skills */}
          <SkillsCard profile={profile} />

          {/* Full Width Job Preferences */}
          <JobPreferencesCard profile={profile} />

          {/* Full Width Personal Information */}
          <PersonalInformation profile={profile} />

          {/* Full Width Education */}
          <EducationCard profile={profile} />
        </div>
      </main>
    </div>
  );
}