// types/achievements.ts
export type InternationalExperienceItemType = {
  _id?: string;
  country?: string;
  organization?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  certificate?: string;
};

export type AchievementItemType = {
  _id?: string;
  title?: string;
  event?: string;
  date?: string;
};

export type AwardItemType = {
  _id?: string;
  title?: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type PublicationItemType = {
  _id?: string;
  title?: string;
  url?: string;
};

export type LeadershipItemType = {
  _id?: string;
  organization?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};