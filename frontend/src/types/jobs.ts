export interface JobCardProps {
  title: string;
  company: string;
  location?: string;
  matchScore?: number;
  postedBy: string;
  secondaryInfo?: string;
  route: string;
  workMode:string;
};

export interface JobContainerProps {
  jobs: any[];
  loading: boolean;
  type: "offcampus" | "referral";
}

export interface JobDetailPageProps {
  job: any;
}