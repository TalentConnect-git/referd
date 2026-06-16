export interface AlumniCardProps {
  name: string;
  role: string;
  company: string;
  college: string;
  openRoles: number;
}
export interface AppStatusRowProps {
    company: string;
    role: string;
    stage: string;
}

export interface BasicJobDetailsProps {
  formData: any;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => void;
  invalidFields: string[];
}

export interface CompensationSectionProps {
  job: any;
}

export interface DashboardAluminiProps{
  userType:string;
}
export interface Alumni {
  _id: string;
  name?: string;
  fullName?: string;
  college?: string|null;
  currentCompany?: string;
  jobRoles?: string[];
  referralMetrics?: {
  totalReferralsPosted?: number;
  };
}
export interface DashboardAppStatusProps {
  applications:any[];
}

export type UserType = "student" | "fresher" | "professional";

export interface DashboardHeaderProps  {
  userName: string;
  userType: string;
};

export type CandidatePosted = {
  _id?: string;
  name?: string;
  email?: string;
  currentCompany?: string;
  userId?: string;
};

export type Job = {
  _id?: string;
  id?: string;

  jobTitle?: string | string[];
  title?: string;

  companyName?: string;
  currentCompany?: string;
  company?: string;

  location?: string | string[];
  workLocation?: string[];

  jobType?: string;
  employmentType?: string[];
  workMode?: string[];

  matchScore?: number;
  candidatePosted?: CandidatePosted;
};

export interface DashboardJobsProps {
    referralJobs: Job[];
    internshipJobs: Job[] ;
    offCampusJobs: Job[];
    allJobs: Job[];
}

export interface DashboardProfStatsProps {
    referralsPosted: number;
    applicationsReceived: number;
    responseRate: number;
    successRate: number;
}
export interface DashboardStatsProps {
  userType: string;
}

export interface DashboardStudStatsProps {
  applicationsSent: number;
  interviewCalls: number;
  resumeScore: number;
  hiringScore: number;
}

export interface JobRowProps  {
  id: string;
  logoLetter: string;
  title: string;
  company: string;
  location: string;
  referredBy: string;
  matchScore: number;
  onClick?: () => void;
  jobType:string;
};
export interface JobDetailsModalProps {
  open: boolean;
  onClose: () => void;
  job: any;
  allJobs: any[];
  onSelectJob:(job: any) => void;
}

export interface LeftPanelProps {
  job: any;
}
export interface OverviewSectionProps {
  job: any;
}
export interface ProcessSectionProps {
  job: any;
}

export interface RequirementSectionProps {
  job: any;
}

export interface RightPanelProps {
  allJobs: any[];
  onSelectJob: (job: any) => void;
}
export interface SelectionCriteriaProps {
  formData: any;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => void;
}