export interface InternshipContainerProps {
  internships: any[];
  loading: boolean;

}

export interface InternshipCardProps {
  title: string;
  company: string;
  location: string;
  matchScore?: number;
  postedBy: string;
  secondaryInfo?: string;
  route: string;
}