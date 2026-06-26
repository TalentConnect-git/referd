// types/referrals.ts

export type Job = {
  _id?: string;
  title?: string;
  companyName?: string;
  companySlug?: string;
  companyNormalized?: string;
  location?: string;
  workMode?: string;
  department?: string;
  matchScore?: number;
  alumniCount?: number;
  jobUrl?: string;
  applyUrl?: string;
  requiredSkills?: string[];
  matchedSkills?: string[];
  missingSkills?: string[];
  experienceRequired?: string;
  description?: string;
  jdSnippet?: string;
  atsSource?: string;
  jobId?: string;
  postedDate?: string | Date;  // Add this property
  scoreBreakdown?: {            // Add score breakdown for match details
    skills?: number;
    role?: number;
    experience?: number;
    location?: number;
    workMode?: number;
    candidateType?: number;
  };
  createdAt?: string;           // Add timestamp fields
  updatedAt?: string;
  discoveredAt?: string;
  expiresAt?: string;
  isActive?: boolean;
  referralRequested?: boolean;
  onboardingId?: string;
  totalEmployeeCount?: number;
};

export type AlumniProfile = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string | null;
  backgroundImage?: string | null;
  college?: string | null;
  currentCompany?: string;
  totalYearsOfExperience?: string | null;
  jobRoles?: string[];
  linkedin?: string;
  github?: string;
  educations?: {
    college?: string;
    degree?: string;
    specialization?: string;
    cgpa?: string;
    yearOfGraduation?: string;
    educationType?: string;
    isCurrent?: boolean;
    _id?: string;
  }[];
  portfolio?: string;
  about?: string | null;
  experiences?: {
    company?: string;
    role?: string;
    startDate?: string;
    endDate?: string | null;
    description?: string;
    isCurrent?: boolean;
    _id?: string;
  }[];
  referralMetrics?: {
    totalReferralsPosted: number;
    totalApplicationsReceived: number;
    totalReferredToCompany: number;
    totalAcceptedByCompany: number;
    responseRate: number;
    referralSuccessRate: number;
  };
  referralJobs?: any[];
  isHiring?: boolean;
  isAlumni?: boolean;
  isCurrentEmployee?: boolean;
  companyCareerPageUrl?: string;
};

export type ReferralJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedDate: string;
  referralCount: number;
  matchPercentage: number;
  status: 'active' | 'pending' | 'expired';
};