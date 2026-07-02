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

export interface AlumniDetailProfileProps {
  profile: Alumni;
}

export interface AlumniDetailOpenPositionsProps {
  userProfile:Alumni;
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

export interface ReferralJob {
  _id: string;
  companyName: string;
  jobTitle: string[];
  jobStatus: string;
  careerPageUrl: string;
  description: string;
  createdAt: string;
  jobType:string;
}

export interface Alumni {
  name: string;
  about: string;

  userId:string;
  totalYearsOfExperience:string;
  currentCompany:string;

  email: string;
  phone: string;

  linkedin: string;
  github: string;
  portfolio: string;
  resume: string;
  isHiring:string;

  profileImage: string;

  currentCompany_display: string;

  locations: string[];

  experiences: Experience[];

  educations: Education[];

  skills: string[];

  toolsAndPlatforms: string[];

  referralJobs: ReferralJob[];
}





