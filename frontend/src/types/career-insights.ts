// types/career-insights.ts

export interface CategorizedSkills {
  highInDemand: string[];
  growing: string[];
  saturated: string[];
  obsolete: string[];
}

export interface HiringBreakdown {
  profileScore: number;
  activityScore: number;
  applicationQualityScore: number;
}

export interface CareerInsightsData {
  _id: string;
  categorizedSkills: CategorizedSkills;
  hiringBreakdown: HiringBreakdown;
  hiringInsights: string[];
  hiringScore: number;
  lastAnalyzedAt: string;
  missingSkills: string[];
  resumeScore: number;
  suggestions: string[];
  updatedAt: string;
}

export interface CareerInsightsResponse {
  success: boolean;
  data: CareerInsightsData;
}