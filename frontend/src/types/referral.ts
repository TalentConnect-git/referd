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

  certifications:string[];
  selectionProcess:string[];
  workAuthorization:string[];
  rounds:string[];
  studentStreams:string[];
  minEducation:string;
  yearsOfExperience:string;
  skills:string[];
  eligibilityCriteria:string;

  approvalStatus: string;
  jobStatus: string;
  inactive: boolean;

  description: string;

  packageDetails: {
    currency: string;
    totalCTC: number;
    fixedPay:number;
    joiningBonus:number;
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
};

export interface ReferralCardProps {
  referral: ReferralJob;
  onViewDetails: () => void;
  handleDelete:()=>void;
  onPause:()=>void;
};

export interface ReferralCardHeaderProps {
  referral: ReferralJob;
};

export interface ReferralActionsProps {
  referral: ReferralJob;
  onViewDetails?: () => void;
  onPause?: () => void;
  handleDelete?: () => void;
  inactive:boolean;
};
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
  onSubmit: (
    startDate: string,
    endDate: string
  ) => void;
}