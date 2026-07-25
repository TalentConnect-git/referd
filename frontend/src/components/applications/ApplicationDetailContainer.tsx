"use client";

import ApplicationDetailHeader from "./ApplicationDetailHeader";
import ApplicationDetailAssessment from "./ApplicationDetailAssessment";
import ApplicationDetailEducation from "./ApplicationDetailEducation";
import ApplicationDetailExperience from "./ApplicationDetailExperience";
import ApplicationDetailSkills from "./ApplicationDetailSkills";
import ApplicationDetailReferralRequest from "./ApplicationDetailReferralRequest";
import ApplicationDetailTimeline from "./ApplicationDetailTimeline";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApplicationDetailContainerProps {
  application: any;
}

export default function ApplicationDetailContainer({
  application,
}: ApplicationDetailContainerProps) {

  const router = useRouter();
  const applicant = application?.applicant;
  console.log("Applicant ",applicant);

  return (
    <div className="mx-auto max-w-7xl space-y-6 bg-[var(--background)] px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] cursor-pointer"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
        <span className="text-sm font-medium">Back to Applications</span>
      </button>

      <ApplicationDetailHeader
        applicant={applicant}
        application={application}
      />

      <ApplicationDetailAssessment
        application={application}
        applicant={applicant}
      />

      <ApplicationDetailEducation
        educations={applicant?.educations}
      />

      <ApplicationDetailExperience
        experiences={applicant?.experiences}
      />

      <ApplicationDetailSkills
        skills={applicant?.skills}
        toolsAndPlatforms={
          applicant?.toolsAndPlatforms
        }
      />

      {/* <ApplicationDetailReferralRequest
        job={application?.job}
      /> */}

      <ApplicationDetailTimeline
        statusHistory={
          application?.statusHistory
        }
      />
    </div>
  );
}