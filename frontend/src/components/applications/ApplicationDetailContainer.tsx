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
    <div className="p-6 space-y-6">
        {/* Back Button */}

      <button

        onClick={() => router.back()}
        className="
          flex
          items-center
          gap-2
          text-slate-400
          hover:text-white
          transition-colors
          cursor-pointer">

        <ArrowLeft size={18} />

        <span>Back to Applications</span>

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