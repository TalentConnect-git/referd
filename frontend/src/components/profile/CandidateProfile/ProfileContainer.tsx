"use client";

import CandidateHeader from "./CandidateHeader";
import PersonalInfo from "./PersonalInfo";
import EducationCard from "./EducatonCard";
import ExperienceCard from "./ExperienceCard";
import NoticePeriodCard from "./NoticePeriod";
import JobPreferencesCard from "./JobPreferencesCard";
import AboutCard from "./AboutCard";
import SkillsCard from "./SkillsCard";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Trophy,
} from "lucide-react";

import { ProfileData } from "@/types/profile";

interface ProfileContainerProps {
  profile: ProfileData;
}

export default function ProfileContainer({
  profile,
}: ProfileContainerProps) {
const router = useRouter();
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <main className="grid gap-6 px-8 py-7 xl:grid-cols-[1fr_420px]">
        {/* Left Column */}
        <section className="space-y-6">
          <CandidateHeader profile={profile} />

          <NoticePeriodCard profile={profile} />
 
          <PersonalInfo profile={profile} />

          <EducationCard profile={profile} />

          <ExperienceCard profile={profile} />

        </section>

        {/* Right Column */}
        {/* <Sidebar
          profile={profile}
          resumeModalOpen={false}
          setResumeModalOpen={() => {}}
        /> */}


            <section className="space-y-6">
            <JobPreferencesCard profile={profile} />
            <AboutCard profile={profile} />
            <SkillsCard profile={profile} />
            </section>



      </main>
    </div>
  );

    





}