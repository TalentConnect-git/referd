// types/jobs.ts

export interface PackageDetails {
  currency?: string;
  totalCTC?: number;
  fixedPay?: number;
  joiningBonus?: number;
  variablePay?: number;
  [key: string]: any;
}

export interface JobCardProps {
  title: string;
  company: string;
  location?: string;
  matchScore?: number;
  postedBy: string;
  secondaryInfo?: string;
  route: string;
  workMode?: string;
  jobId?: string;
  jobType?: string;
  isSaved?: boolean;
  packageDetails?: PackageDetails;
  onSaveToggle?: (jobId: string, isSaved: boolean) => void;
  alumniCount?: number; 
}

export interface Job {
  _id: string;
  jobTitle?: string[];
  companyName?: string;
  location?: string[];
  workLocation?: string[];
  workMode?: string[];
  employmentType?: string[];
  jobType?: string;
  workType?: string;
  city?: string;
  matchScore?: number;
  isSaved?: boolean;
  saved?: boolean;
  postedBy?: string;
  packageDetails?: PackageDetails;
  receiverProfile?: {
    name?: string;
    currentCompany_display?: string;
    currentCompany?: string;
  };
  candidatePosted?: {
    name?: string;
    currentCompany?: string;
  };
  broadcastType?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  requirements?: string[];
  skills?: string[];
  [key: string]: any;
}

export interface JobContainerProps {
  jobs: Job[];
  loading: boolean;
  type: "offcampus" | "referral";
}

export interface JobDetailPageProps {
  job: Job;
}