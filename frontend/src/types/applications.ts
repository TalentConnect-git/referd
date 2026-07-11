// types/application.ts

// ============================================
// Application Type Definitions
// ============================================

export type ApplicationType = "Referral" | "Internship" | "Off-campus";

export type ProfessionalApplicationType =
  | "Requests Received"
  | "Applications By Me"
  | "Referred By Me";

export type ApplicationStatus =
  | "Application Sent"
  | "Applied"
  | "Referred To Company"
  | "Accepted"
  | "Approved"
  | "Rejected"
  | "Waitlist"
  | "Pending"
  | "Reviewed";

// ============================================
// Base Application Interface
// ============================================

export interface Application {
  _id: string;
  applicant: Applicant;
  job: Job;
  matchScore?: number;
  createdAt?: string;
  updatedAt?: string;
  adminComment?: string;
  rating?: number;
  applicantType?: string;
  currentStatus?: ApplicationStatus | string;
  adminApprovalStatus?: string;
  statusHistory?: StatusHistory[];
  [key: string]: any;
}

// ============================================
// Applicant Interface
// ============================================

export interface Applicant {
  _id?: string;
  userId?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  currentCompany?: string;
  currentCompany_display?: string;
  profileType?: string;
  about?: string;

  skills?: string[];
  toolsAndPlatforms?: string[];
  jobRoles?: string[];
  educations?: Education[];
  education?: Education[];
  experiences?: Experience[];
  experience?: Experience[];

  achievements?: Achievement[];
  awards?: Award[];
  publications?: Publication[];
  leadership?: Leadership[];
  internationalExperience?: InternationalExperience[];

  languagesKnown?: string[];
  locations?: string[];
  industry?: string[];
  domainKnowledge?: string[];
  employmentType?: string[];
  lookingFor?: string[];

  resume?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;

  dob?: string;
  gender?: string;
  ethnicity?: string;
  maritalStatus?: string;
  visaStatus?: string;

  openToShift?: string;
  servingNoticePeriod?: boolean;
  noticePeriod?: string;
  noticePeriodStartDate?: string;
  totalYearsOfExperience?: string;

  currentSalaryAmount?: string;
  currentSalaryCurrency?: string;
  expectedSalaryAmount?: string;
  expectedSalaryCurrency?: string;

  companyEmail?: string;
  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
}

// ============================================
// Education Interface
// ============================================

export interface Education {
  _id?: string;
  college?: string;
  college_display?: string;
  college_master_id?: string;
  degree?: string;
  specialization?: string;
  semester?: string;
  yearOfGraduation?: string;
  cgpa?: string;
  educationType?: string;
  isCurrent?: boolean;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

// ============================================
// Experience Interface
// ============================================

export interface Experience {
  _id?: string;
  company?: string;
  company_display?: string;
  company_master_id?: string;
  organization?: string;
  role?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  noticePeriod?: string;
  officialCompanyEmail?: string;
  [key: string]: any;
}

// ============================================
// Achievement / Award / Publication Interfaces
// ============================================

export interface Achievement {
  _id?: string;
  title?: string;
  event?: string;
  date?: string;
  description?: string;
  [key: string]: any;
}

export interface Award {
  _id?: string;
  title?: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  [key: string]: any;
}

export interface Publication {
  _id?: string;
  title?: string;
  url?: string;
  [key: string]: any;
}

export interface Leadership {
  _id?: string;
  company?: string;
  organization?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  [key: string]: any;
}

export interface InternationalExperience {
  _id?: string;
  country?: string;
  organization?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  [key: string]: any;
}

// ============================================
// Job Interface
// ============================================

export interface Job {
  _id: string;

  /**
   * For company-posted off-campus/internship jobs,
   * title may come from jobRole.
   *
   * For referral jobs,
   * title may come from jobTitle.
   */
  jobTitle?: string | string[];
  jobRole?: string | string[];

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

  isAskForReferral?: boolean;

  receiverProfile?: {
    name?: string;
    currentCompany_display?: string;
    currentCompany?: string;
  };

  candidatePosted?: {
    name?: string;
    currentCompany?: string;
  };

  description?: string;
  requirements?: string[];
  skills?: string[];

  [key: string]: any;
}

// ============================================
// Package Details Interface
// ============================================

export interface PackageDetails {
  currency?: string;
  totalCTC?: number;
  fixedPay?: number;
  joiningBonus?: number;
  variablePay?: number;
  [key: string]: any;
}

// ============================================
// Meta Interface
// ============================================

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// Component Props Interfaces
// ============================================

export interface ApplicationTabsProps {
  activeTab: ApplicationType;
  onStatusUpdate?: () => void;
  onChange: (tab: ApplicationType) => void;
}

export interface ApplicationTableProps {
  applicationType: string;
  applications: any[];
  page?: number;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  onPageChange?: (page: number) => void;
  onStatusUpdate?: () => void;
}

export interface ApplicationStatsProps {
  applicationType: ApplicationType;
  applications: Application[];
}



export interface ApplicationsToMeTableProps {
  applications: Application[];
  page: number;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  onPageChange?: (page: number) => void;
}

/**
 * Kept for backward compatibility because existing code may be importing
 * the older misspelled name.
 */
export interface ApplicationalsToMeTableProps extends ApplicationsToMeTableProps {}

export interface ProfessionalApplicationTabsProps {
  activeTab: ProfessionalApplicationType;
  onChange: (tab: ProfessionalApplicationType) => void;
}

export interface StageIndicatorProps {
  stage: string;
}

// ============================================
// Application Detail Component Props
// ============================================

export interface ApplicationDetailContainerProps {
  application: Application;
}

export interface ApplicationDetailHeaderProps {
  applicant: Applicant;
  application:Application;
}

export interface ApplicationDetailAssessmentProps {
  application: Application;
  applicant: Applicant;
}

export interface ApplicationDetailEducationProps {
  educations: Education[];
}

export interface ApplicationDetailExperienceProps {
  experiences: Experience[];
}

export interface ApplicationDetailSkillsProps {
  skills: string[];
  toolsAndPlatforms: string[];
}

export interface ApplicationDetailReferralRequestProps {
  job: Job;
}

export interface ApplicationDetailTimelineProps {
  statusHistory: StatusHistory[];
}

export interface ApplicationDetailActionsProps {
  application: Application;
}

export interface ApplicationDetailSocialLinksProps {
  applicant: Applicant;
}

// ============================================
// Incoming Requests Component Props
// ============================================

export interface IncomingRequestCardProps {
  application: Application;
  onStatusUpdate?: (applicationId: string, status: string) => void;
}

export interface IncomingRequestsProps {
  limit?: number;
}

// ============================================
// Saved Jobs Component Props
// ============================================

export interface SavedJobCardProps {
  savedJob: {
    _id: string;
    job: Job;
  };
  onUnsave: (jobId: string) => void;
  onClick: () => void;
}

// ============================================
// Status History Interface
// ============================================

export interface StatusHistory {
  _id?: string;
  status: string;
  changedAt: string;
  changedBy?: string;
  comment?: string;
  [key: string]: any;
}

// ============================================
// API Response Interface
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  msg?: string;
  message?: string;
  data?: T;
  status?: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
  meta?: PaginationMeta;
}

// ============================================
// Helper Functions
// ============================================

export const getMatchScoreColor = (score?: number): string => {
  const numericScore = Number(score) || 0;

  if (numericScore >= 75) return "text-green-400";
  if (numericScore >= 40) return "text-orange-400";

  return "text-red-400";
};

export const getMatchScoreBg = (score?: number): string => {
  const numericScore = Number(score) || 0;

  if (numericScore >= 75) return "bg-green-500";
  if (numericScore >= 40) return "bg-orange-500";

  return "bg-red-500";
};

export const getMatchScoreLabel = (score?: number): string => {
  const numericScore = Number(score) || 0;

  if (numericScore >= 75) return "High Match";
  if (numericScore >= 40) return "Medium Match";

  return "Low Match";
};

export const formatDateToIST = (dateString?: string): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleString("en-IN", options);
  } catch {
    return "Invalid Date";
  }
};