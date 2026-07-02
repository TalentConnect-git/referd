export type Option = {
  value: string;
  label: string;
};

export type Education = {
  _id?: string;
  college?: string;
  degree?: string;
  specialization?: string;
  semester?: string;
  cgpa?: string;
  yearOfGraduation?: string;
  degreeCertificate?: string;
  startDate?: string;
  endDate?: string;
  educationType?: string;
  isCurrent?: boolean;
  college_display?:string;
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

export type ProfileData = {
  _id?: string;
  userId?: string;
  profileType?: "student" | "fresher" | "professional" | string;

  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  about?: string;

  visaStatus?:string;

  gender?: string;
  dob?: string;
  ethnicity?: string;
  maritalStatus?: string;

  linkedin?: string;
  github?: string;
  portfolio?: string;
  profileImage?: string;
  resume?: string;

  responseRate?: number;

  educations?: Education[];
  education?: Education[];


  currentSalaryAmount?: string;
  currentSalaryCurrency?: string;

  expectedSalaryAmount?: string;
  expectedSalaryCurrency?: string;

  experiences?: Experience[];
  experience?: Experience[];

  internationalExperience?: InternationalExperience[];
  leadership?: Leadership[];
  achievements?: Achievement[];

  skills?: string[];
  toolsAndPlatforms?: string[];
  languagesKnown?: string[];
  domainKnowledge?: string[];
  jobRoles?: string[];
  locations?: string[];
  employmentType?: string[];
  lookingFor?: string[];
  industry?: string[];

  currentCompany?: string;
  companyEmail?: string;
  totalYearsOfExperience?: string;
  noticePeriod?: string;
  openToShift?: string;

  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  maritalStatus: string;

  linkedin: string;
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
  companyEmail: string;
  totalYearsOfExperience: string;
  noticePeriod: string;
  openToShift: string;
};

export type MasterData = {
  colleges: Option[];
  degrees: Option[];
  streamsByDegree: Record<string, Option[]>;
  industries: Option[];
  jobRoles: Option[];
};

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