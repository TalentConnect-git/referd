// services/alumni.service.ts

// 👇 Replace this import path with your actual axios instance location
import axiosInstance  from "@/lib/axiosInstance"; // or wherever your axios instance lives


// ---------- Types ----------
type Education = {
  college?: string;
  degree?: string;
  specialization?: string;
  semester?: string;
  cgpa?: string;
  yearOfGraduation?: string;
  startDate?: string;
  endDate?: string;
  educationType?: string;
  isCurrent?: boolean;
  _id?: string;
};

type Experience = {
  company?: string;
  companyName?: string;
  company_canonical_id?: string;
  company_display?: string;
  company_master_id?: string;
  role?: string;
  title?: string;
  designation?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  experienceCertificate?: unknown;
  isCurrent?: boolean;
  _id?: string;
};

type ReferralJob = {
  _id?: string;
  title?: string;
  company?: string;
  location?: string;
  jobTitle?: string[];
};

type ReferralMetrics = {
  totalReferralsPosted?: number;
  totalApplicationsReceived?: number;
  totalReferredToCompany?: number;
  totalAcceptedByCompany?: number;
  responseRate?: number;
  referralSuccessRate?: number;
  totalReferrals?: number;
  successfulReferrals?: number;
  pendingReferrals?: number;
};

export type AlumniProfile = {
  _id: string;
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string | null;
  backgroundImage?: string | null;
  college?: string | null;
  colleges?: string[];
  currentCompany?: string;
  totalYearsOfExperience?: string | null;
  jobRoles?: string[];
  linkedin?: string;
  github?: string;
  educations?: Education[];
  portfolio?: string;
  about?: string | null;
  experiences?: Experience[];
  referralMetrics?: ReferralMetrics;
  referralJobs?: ReferralJob[];
  isHiring?: boolean;
};

type CollegeApiResponse = {
  success: boolean;
  message: string;
  colleges: string[];
  jobPostedOnly: boolean;
  data: AlumniProfile[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// Updated HiringApiResponse to match the new unified format
type HiringApiResponse = {
  success: boolean;
  message: string;
  colleges: string[];
  companiesChecked: string[];
  jobPostedOnly: boolean;
  data: AlumniProfile[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

type CompanyApiResponse = {
  success: boolean;
  errorCode: string | null;
  message: string;
  companiesChecked: string[];
  jobPostedOnly: boolean;
  totalAlumni?: number;
  data: AlumniProfile[];
  alumniByCompany: Record<string, AlumniProfile[]>;

  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export type ApiResponse = CollegeApiResponse | CompanyApiResponse | HiringApiResponse;

// ---------- URL builder ----------
const DEFAULT_LIMIT = 10;

const getApiUrl = (tab: "hiring" | "college" | "company", page: number): string => {
  if (tab === "hiring") {
    return `/api/candidate/hiring-network?jobPostedOnly=true&page=${page}&limit=${DEFAULT_LIMIT}`;
  }
  if (tab === "college") {
    return `/api/candidate/college-alumni?page=${page}&limit=${DEFAULT_LIMIT}`;
  }
  return `/api/candidate/company-alumni?page=${page}&limit=${DEFAULT_LIMIT}`;
};

// ---------- Main API call ----------
export async function fetchAlumniData(
  tab: "hiring" | "college" | "company",
  page: number,
): Promise<ApiResponse> {
  const url = getApiUrl(tab, page);
  const { data } = await axiosInstance.get<ApiResponse>(url);
  console.log(data);
  return data;
}


export const getAlumniDetails = async (
  alumniId: string
) => {
  const { data } = await axiosInstance.get(
    `/api/onboarding/get-details/${alumniId}`
  );

  return data;
};


export const getAlumniWhoCanHelp = async (
  jobId: string,
  company:string
) => {
  const response = await axiosInstance.get(
    `/api/candidate/alumni/${company}/${jobId}`
  );
  return response.data;
};


