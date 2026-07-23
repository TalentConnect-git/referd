// types/profile.ts

export type Option = {
  value: string;
  label: string;
};

export type ShiftPreferences = {
  Day: boolean;
  Night: boolean;
  Rotational: boolean;
  Any?: boolean;
};




export type Education = {
  _id?: string;
  college?: string;
  college_canonical_id?: string;
  college_display?: string;
  college_master_id?: string;
  degree?: string;
  specialization?: string;
  semester?: string;
  cgpa?: string;
  yearOfGraduation?: string;
  degreeCertificate?: string;
  startDate?: string;
  endDate?: string;
  educationType?: "school" | "diploma" | "bachelors" | "masters" | "phd" | "certification" | "other";
  isCurrent?: boolean;
  // Old frontend fields for compatibility
  collegeName?: string;
  course?: string;
  graduationYear?: string;
};

export type Experience = {
  _id?: string;
  company?: string;
  organization?: string;
  role?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  description?: string | string[];
  isCurrent?: boolean;
  noticePeriod?: string;
  officialCompanyEmail?: string;
  location?: string;
  company_canonical_id?: string;
  company_display?: string;
  // company_master_id?: string;
  companyEmail?:string;
  experienceCertificate?:string;
};

export type InternationalExperience = {
  _id?: string;
  country?: string;
  organization?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type Leadership = {
  _id?: string;
  company?: string;
  organization?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type Achievement = {
  _id?: string;
  title?: string;
  event?: string;
  date?: string;
  description?: string;
};

export type Award = {
  _id?: string;
  title?: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type Publication = {
  _id?: string;
  title?: string;
  url?: string;
};

export type Project = {
  name: string;
  description?: string;
  link?: string;
  technologies?: string[];
};

export type ProfileData = {
  _id?: string;
  userId?: string;
  profileType?: "student" | "fresher" | "professional" | string;
  
  // Basic Info
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  about?: string;
  
  // Personal Info
  visaStatus?: string;
  gender?: string;
  dob?: string;
  ethnicity?: string;
  maritalStatus?: string;
  languagesKnown?: string[];
  
  // Social & Media
  linkedin?: string;
  github?: string;
  portfolio?: string;
  profileImage?: string;
  resume?: string;
  responseRate?: number;
  
  // Salary
  currentSalaryAmount?: string;
  currentSalaryCurrency?: string;
  expectedSalaryAmount?: string;
  expectedSalaryCurrency?: string;
  
  // Shift Preferences
  shiftPreferences?: ShiftPreferences;
  openToShift?: string;
  
  // Education
  educations?: Education[];
  education?: Education[];
  
  // Experience
  experiences?: Experience[];
  experience?: Experience[];
  
  // International Experience
  internationalExperience?: InternationalExperience[];
  
  // Leadership
  leadership?: Leadership[];
  
  // Achievements
  achievements?: Achievement[];
  awards?: Award[];
  publications?: Publication[];
  projectsHandled?: Project[];
  
  // Skills & Domain
  skills?: string[];
  toolsAndPlatforms?: string[];
  domainKnowledge?: string[];
  industry?: string[];
  categorizedSkills?: {
    highInDemand?: string[];
    growing?: string[];
    saturated?: string[];
    obsolete?: string[];
  };
  
  // Job Preferences
  jobRoles?: string[];
  locations?: string[];
  clientLocation?: string;
  employmentType?: string[];
  lookingFor?: string[];
  
  // Company & Notice Period
  currentCompany?: string;
  currentCompany_display?: string;
  companyEmail?: string;
  totalYearsOfExperience?: string;
  noticePeriod?: string;
  noticePeriodStartDate?: string;
  servingNoticePeriod?: boolean;
  
  // Referral
  referralMilestonesAchieved?: any[];
  totalCandidatesReferred?: number;
  referralSource?: string;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  emailVerified?: boolean;
  __v?: number;
  
  // Additional fields from various components
  certifications?: string;
  projects?: Project[];
  portfolioLinks?: string[];

  
};

export type EditForm = {
  fullName: string;
  name: string;
  email: string;
  phone: string;
  about: string;
  gender: string;
  dob: string;
  ethnicity: string;
  award:Award[];
  publications: Publication[];
  maritalStatus: string;
  linkedin: string;
  visaStatus: string;
  github: string;
  portfolio: string;
  profileImage: string;
  resume: string;
  educations: Education[];
  experiences: Experience[];
  internationalExperience: InternationalExperience[];
  leadership: Leadership[];
  achievements: Achievement[];
  skills: string[];
  toolsAndPlatforms: string[];
  languagesKnown: string[];
  domainKnowledge: string[];
  jobRoles: string[];
  locations: string[];
  employmentType: string[];
  lookingFor: string[];
  industry: string[];
  currentCompany: string;
  currentCompany_display?: string;
  companyEmail: string;
  totalYearsOfExperience: string;
  noticePeriod: string;
  noticePeriodStartDate?: string;
  servingNoticePeriod?: boolean;
  openToShift: string;
  shiftPreferences?: ShiftPreferences;
  currentSalaryCurrency: string;
  currentSalaryAmount: string;
  expectedSalaryCurrency: string;
  expectedSalaryAmount: string;
  
};


export type MasterData = {
  colleges: Option[];
  degrees: Option[];
  streamsByDegree: Record<string, Option[]>;
  industries: Option[];
  jobRoles: Option[];
};

// Component Props Types
export interface ProfileContainerProps {
  profile: ProfileData;
}

export interface PersonalInfoProps {
  profile: ProfileData;
}

export interface EducationCardProps {
  profile: ProfileData;
}

export interface ExperienceCardProps {
  profile: ProfileData;
}

export interface NoticePeriodCardProps {
  profile: ProfileData;
}

export interface JobPreferencesCardProps {
  profile: ProfileData;
}

export interface AboutCardProps {
  profile: ProfileData;
}

export interface SkillsCardProps {
  profile: ProfileData;
}

export interface CandidateHeaderProps {
  profile: ProfileData;
}

export interface ContactCardProps {
  profile: ProfileData & {
    email?: string;
    phone?: string;
  };
}

export interface AchievementsCardProps {
  profile: ProfileData;
}