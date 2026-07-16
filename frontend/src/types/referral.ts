export interface ReferralMetrics {
  totalApplicationsReceived: number;
  totalReferredToCompany: number;
  totalInterviewScheduled: number;
  totalAcceptedByCompany: number;
  responseRate: number;
  referralSuccessRate: number;
}

export interface ReferralJob {
  _id: string;

  jobTitle: string[];
  location: string[];

  certifications: string[];
  selectionProcess: string[];
  workAuthorization: string[];
  rounds: string[];
  studentStreams: string[];
  minEducation: string;
  yearsOfExperience: string;
  skills: string[];
  eligibilityCriteria: string;

  approvalStatus: string;
  jobStatus: string;
  inactive: boolean;

  description: string;

  packageDetails: {
    currency: string;
    totalCTC: number;
    fixedPay: number;
    joiningBonus: number;
  };

  metrics: ReferralMetrics;
  jobRoles?: string[];
  benefits?: string[];
  cgpa?: number;
  numberOfOpenings?: number;
  batchYear?: string[];

  jobType: string;
}

export interface ReferralPaginationProps {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export interface ReferralStatsProps {
  metrics: ReferralMetrics;
  onViewDetails?: () => void;
}

export interface ReferralCardProps {
  referral: ReferralJob;
  onViewcandidate?: () => void;
  onViewDetails: () => void;
  handleDelete: () => void;
  onPause: () => void;
}

export interface ReferralCardHeaderProps {
  referral: ReferralJob;
}

export interface ReferralActionsProps {
  referral: ReferralJob;
  onViewDetails?: () => void;
  onPause?: () => void;
  handleDelete?: () => void;
  inactive: boolean;
}
export interface ReferralDetailsProps {
  referral: ReferralJob;
  onClose: () => void;
}
export interface ReferralDetailsCandidatesProps {
  referral: ReferralJob;
}
export interface ReferralDetailsOverviewProps {
  referral: ReferralJob;
}

export interface ReferralDetailsHeaderProps {
  referral: ReferralJob;
}
export interface ReferralCandidate {
  _id: string;

  applicant: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profileType: string;
  };

  applicantType: string;
  adminApprovalStatus: string;
  currentStatus: string;
  matchScore: number;
  createdAt: string;
}

export interface ResumeReferralProps {
  onClose: () => void;
  onSubmit: (startDate: string, endDate: string) => void;
}

// types/referral.ts

export interface PackageDetails {
  currency: string;
  totalCTC?: number;
  fixedPay?: number;
  joiningBonus?: number;
}

export interface ContactPerson {
  name?: string;
  designation?: string;
  email?: string;
  mobile?: string;
  linkedin?: string;
}

export interface ProposedSchedule {
  startDate?: Date;
  endDate?: Date;
  preferredMode?: "Online" | "Offline" | "Hybrid";
}

export interface InterviewWindow {
  start?: Date;
  end?: Date;
}

export interface State {
  _id: string;
  name: string;
  code?: string;
  country: string;
}

export interface City {
  _id: string;
  name: string;
  state: string;
  country: string;
}

export interface Degree {
  _id: string;
  name: string;
  type: string;
}

export interface Stream {
  _id: string;
  name: string;
  parent: string;
}

export interface ReferralPostingPayload {
  // Basic Job Details
  jobTitle: string[];
  companyName?: string;
  location: string[];
  workMode: string[];
  employmentType: string[];
  description?: string;
  degree?:string[];
  packageDetails: PackageDetails;
  skills: string[];
  experience?: string;

  certifications?: string[];
  benefits?: string[];
  tags?: string[];
  numberOfOpenings?: number;

  // Location
  state?: string;
  city?: string;
  country?: string;

  // Selection Criteria
  cgpa?: number;
  studentStreams?: string[];
  batchYear?: string[];
  eligibilityCriteria?: string;
  selectionProcess?: string[];
  rounds?: string[];
  onlineTestDate?: Date;
  interviewWindow?: InterviewWindow;
  proposedSchedule?: ProposedSchedule;
  venue?: string;

  // Additional fields
  isAskForReferral?: boolean;
  referralRequestId?: string | null;
  senderProfile?: any;
  receiverProfile?: any;
  broadcastType?: string;
  visibleTo?: string;
  pincode?: string;
  workLocation?: string[];
  expireAt?: Date;
  inactive?: boolean;
  contactPerson?: ContactPerson;
  
  stream?: string;
  [key: string]: any;
}

export interface BasicJobDetailsProps {
  formData: ReferralPostingPayload;
  setFormData: (data: ReferralPostingPayload) => void;
  onNext: () => void;
}

export interface SelectionCriteriaSectionProps {
  formData: ReferralPostingPayload;
  setFormData: (data: ReferralPostingPayload) => void;
  onPrev: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}
