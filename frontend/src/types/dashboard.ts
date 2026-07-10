export interface AlumniCardProps {
  name: string;
  role: string;
  company: string;
  college: string;
  openRoles: number;
  profileImage?:string | null;
  userId:string;
  onClick?: () => void;
}
export interface AppStatusRowProps {
    company: string;
    role: string;
    stage: string;
}

export type PostedByUser = {
  _id: string;
  name?: string | null;
  email?: string;
  profileImage?: string | null;

  isNewUser?: boolean;
  onboardingCompleted?: boolean;
  onboardingStep?: number;

  userType?: "student" | "fresher" | "professional" | "company" | "college" | "admin";

  authProvider?: string;
  status?: string;
  activeCompanyId?: string | null;
  jobVisibilityThreshold?: number;

  lastActivity?: string;
  createdAt?: string;
  updatedAt?: string;
};

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
  userId:string;
  name?: string;
  fullName?: string;
  colleges?: string[]|null;
  currentCompany?: string;
  profileImage?:string | null;
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
  _id: string;
  name?: string;
  email?: string;
  currentCompany?: string;
  userId: string;
};

export type Job = {
  _id: string;

  jobTitle?: string | string[];
  jobRoles?: string[];
  title?: string;
  minEducation:string;


  companyName?: string;
  currentCompany?: string;
  company?: string;

  location?: string | string[];
  workLocation?: string[];

  postedByUser: PostedByUser;

  description:string;
  selectionProcess:string[];
  jobType: string;
  employmentType?: string[];
  workMode?: string[];
  yearsOfExperience?: string;

  endDate:string;

  rounds:string[];

  degree?: string[];
  studentStreams?: string[];
  cgpa?: number;
  eligibilityCriteria?: string;

  numberOfOpenings?: number;
  skills?: string[];

  internshipDuration?: string;

  packageDetails?: {
    currency?: string;
    totalCTC?: number;
    fixedPay?: number;
    joiningBonus?: number;
  };

  matchScore?: number;
  candidatePosted: CandidatePosted;
};

export interface DashboardJobsProps {
    referralJobs: Job[];
    internshipJobs: Job[] ;
    offCampusJobs: Job[];
    allJobs: Job[];
}


export interface DashboardProfStatsProps {
  totalJobsPosted: number;
  approvedJobs: number;
  rejectedJobs: number;
  totalApplicationsDone: number;
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
  workMode?:string[];
  jobType:string;
  isSaved?: boolean;   // Pass true if job is already saved
isApplied?: boolean;
};
export interface JobDetailsModalProps {
  open: boolean;
  onClose: () => void;
  job: Job;
  allJobs: any[];
  onSelectJob:(job: Job) => void;
}
export interface PostedByReferrerProps{
  candidateId:string;
}

export interface LeftPanelProps {
  job: Job;
}
export interface OverviewSectionProps {
  job: Job;
}
export interface ProcessSectionProps {
  job: Job;
}

export interface RequirementSectionProps {
  job: Job;
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

export interface AlumniWhoCanHelpProps {
  job: Job;
}

export interface alumniWhoCanHelp {
  _id: string;
  userId: string;
  name: string;
  currentCompany: string;
  totalYearsOfExperience: string;
  isHiring: boolean;
  experiences: {
    role?: string;
    isCurrent?: boolean;
  }[];
  referralJobs: any[];
  referralMetrics?: {
    totalReferralsPosted?: number;
  };
}






