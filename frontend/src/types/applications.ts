export interface ApplicationalsToMeTableProps {
  applications: any[];
  page: number;
  meta: any;
}
export type ApplicationType =
  | "Referral"
  | "Internship"
  | "Off-campus";

export interface ApplicationTabsProps{
    activeTab:ApplicationType;
    onChange:(tab:ApplicationType)=>void;
    
}
export interface ApplicationStatsProps {
  applicationType: ApplicationType;
  applications: any[];
}
export interface ApplicationTableProps {
  applicationType: ApplicationType;
  applications: any[];
  page: number;
  meta: any;
}
export type ProfessionalApplicationType =
  | "Applications To Me"
  | "Applications By Me";

export interface ProfessionalApplicationTabsProps {
  activeTab: ProfessionalApplicationType;
  onChange: (
    tab: ProfessionalApplicationType
  ) => void;
}
export interface StageIndicatorProps {
  stage: string;
}

//Applications Details Part 
export interface ApplicationDetailContainerProps {
  application: any;
}

export interface ApplicationDetailHeaderProps {
  applicant: any;
}

export interface ApplicationDetailAssessmentProps {
  application: any;
  applicant: any;
}

export interface ApplicationDetailEducationProps {
  educations: any[];
}

export interface ApplicationDetailExperienceProps {
  experiences: any[];
}

export interface ApplicationDetailSkillsProps {
  skills: string[];
  toolsAndPlatforms: string[];
}

export interface ApplicationDetailReferralRequestProps {
  job: any;
}

export interface ApplicationDetailTimelineProps {
  statusHistory: any[];
}

export interface ApplicationDetailActionsProps {
  application: any;
}

export interface ApplicationDetailSocialLinksProps {
  applicant: any;
}