export interface AlumniDetailHeaderProps {
  name: string;
  currentCompany: string;
  currentRole: string;
  college: string;
  locations: string[];
  profileImage?: string;
}


export interface AlumniDetailAboutProps {
  about: string;
}


export interface Experience {
  _id: string;
  company: string;
  company_display: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface AlumniDetailExperienceProps {
  experiences: Experience[];
}


export interface Education {
  _id: string;
  college: string;
  degree: string;
  specialization: string;
  cgpa: string;
  yearOfGraduation: string;
  educationType: string;
  isCurrent: boolean;
}

export interface AlumniDetailEducationProps {
  educations: Education[];
}


export interface AlumniDetailSkillsProps {
  skills: string[];
  toolsAndPlatforms: string[];
}

export interface AlumniDetailContactProps {
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  resume?: string;
}

export interface ReferralJob {
  _id: string;
  companyName: string;
  jobTitle: string[];
  jobStatus: string;
  careerPageUrl: string;
  description: string;
  createdAt: string;
}

export interface AlumniDetailReferralJobsProps {
  referralJobs: ReferralJob[];
}

export interface AlumniDetailContainerProps {
  alumni: Alumni;
}


export interface Alumni {
  name: string;
  about: string;

  email: string;
  phone: string;

  linkedin: string;
  github: string;
  portfolio: string;
  resume: string;

  profileImage: string;

  currentCompany_display: string;

  locations: string[];

  experiences: Experience[];

  educations: Education[];

  skills: string[];

  toolsAndPlatforms: string[];

  referralJobs: ReferralJob[];
}