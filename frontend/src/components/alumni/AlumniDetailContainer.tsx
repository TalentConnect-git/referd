import { AlumniDetailContainerProps } from "@/types/alumni";

import AlumniDetailAbout from "./AlumniDetailAbout";
import AlumniDetailContact from "./AlumniDetailContact";
import AlumniDetailEducation from "./AlumniDetailEducation";
import AlumniDetailExperience from "./AlumniDetailExperience";
import AlumniDetailHeader from "./AlumniDetailHeader";
import AlumniDetailReferralJobs from "./AlumniDetailReferralJobs";
import AlumniDetailSkills from "./AlumniDetailSkills";

export default function AlumniDetailContainer({
  alumni,
}: AlumniDetailContainerProps) {
  return (
    <div className="space-y-6">

      <AlumniDetailHeader
        name={alumni.name}
        currentCompany={alumni.currentCompany_display}
        currentRole={
          alumni.experiences?.[0]?.role || "Professional"
        }
        college={
          alumni.educations?.[0]?.college || "N/A"
        }
        locations={alumni.locations || []}
        profileImage={alumni.profileImage}
      />

      <AlumniDetailAbout
        about={alumni.about}
      />

      <AlumniDetailExperience
        experiences={alumni.experiences || []}
      />

      <AlumniDetailEducation
        educations={alumni.educations || []}
      />

      <AlumniDetailSkills
        skills={alumni.skills || []}
        toolsAndPlatforms={
          alumni.toolsAndPlatforms || []
        }
      />

      <AlumniDetailReferralJobs
        referralJobs={alumni.referralJobs || []}
      />

      <AlumniDetailContact
        email={alumni.email}
        phone={alumni.phone}
        linkedin={alumni.linkedin}
        github={alumni.github}
        portfolio={alumni.portfolio}
        resume={alumni.resume}
      />

    </div>
  );
}