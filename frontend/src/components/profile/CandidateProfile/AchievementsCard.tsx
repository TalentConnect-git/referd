"use client";

import type React from "react";
import {
  Award,
  BookOpen,
  ExternalLink,
  Globe2,
  Trophy,
  Users,
} from "lucide-react";

import { ProfileData } from "@/types/profile";

interface AchievementsCardProps {
  profile: ProfileData;
}

type InternationalExperienceItemType = {
  _id?: string;
  country?: string;
  organization?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  certificate?: string;
};

type AchievementItemType = {
  _id?: string;
  title?: string;
  event?: string;
  date?: string;
};

type AwardItemType = {
  _id?: string;
  title?: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

type PublicationItemType = {
  _id?: string;
  title?: string;
  url?: string;
};

type LeadershipItemType = {
  _id?: string;
  organization?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

const getText = (value?: string | null, fallback = "") => {
  if (!value || !String(value).trim()) return fallback;
  return String(value).trim();
};

const normalizeUrl = (url?: string | null) => {
  if (!url) return "";

  const trimmed = url.trim();

  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const formatDateRange = (startDate?: string, endDate?: string) => {
  const start = getText(startDate);
  const end = getText(endDate);

  if (start && end) return `${start} — ${end}`;
  if (start && !end) return `${start} — Present`;
  if (!start && end) return end;

  return "";
};

const SectionCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => {
  return (
    <section className="rounded-[18px] border border-white/10 bg-[#071018] px-[18px] py-[18px] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#12381f] text-[#37e875]">
          <Icon className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-[14px] font-bold text-white">{title}</h2>
      </div>

      <div className="mt-[18px] border-t border-white/10" />

      <div className="mt-[17px] space-y-4">{children}</div>
    </section>
  );
};

const EmptyItem = ({ text }: { text: string }) => {
  return (
    <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
      <p className="text-[12px] font-normal text-[#7891c7]">{text}</p>
    </div>
  );
};

const InternationalExperienceItem = ({
  item,
}: {
  item: InternationalExperienceItemType;
}) => {
  const title = getText(item.role, "N/A");
  const country = getText(item.country);
  const organization = getText(item.organization);
  const dateRange = formatDateRange(item.startDate, item.endDate);
  const description = getText(item.description);
  const certificateUrl = normalizeUrl(item.certificate);

  return (
    <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
      <h3 className="text-[14px] font-medium leading-tight text-white">
        {title}
      </h3>

      {country && (
        <p className="mt-1.5 text-[12px] font-medium text-[#37e875]">
          {country}
        </p>
      )}

      {organization && (
        <p className="mt-1 text-[12px] font-medium text-[#7891c7]">
          {organization}
        </p>
      )}

      {dateRange && (
        <p className="mt-2 text-[12px] font-medium text-[#7891c7]">
          {dateRange}
        </p>
      )}

      {description && (
        <p className="mt-3 whitespace-pre-line text-[12px] font-normal leading-5 text-white">
          {description}
        </p>
      )}

      {certificateUrl && (
        <a
          href={certificateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#37e875] transition hover:underline"
        >
          View Certificate
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
};

const AchievementItem = ({ item }: { item: AchievementItemType }) => {
  const title = getText(item.title, "N/A");
  const event = getText(item.event);
  const date = getText(item.date);

  return (
    <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
      <h3 className="text-[14px] font-medium leading-tight text-[#37e875]">
        {title}
      </h3>

      {event && (
        <p className="mt-1.5 text-[12px] font-medium text-[#7891c7]">
          {event}
        </p>
      )}

      {date && (
        <p className="mt-2 text-[12px] font-medium text-[#7891c7]">{date}</p>
      )}
    </div>
  );
};

const AwardItem = ({ item }: { item: AwardItemType }) => {
  const title = getText(item.title, "N/A");
  const organization = getText(item.organization);
  const dateRange = formatDateRange(item.startDate, item.endDate);
  const description = getText(item.description);

  return (
    <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
      <h3 className="text-[14px] font-medium leading-tight text-[#37e875]">
        {title}
      </h3>

      {organization && (
        <p className="mt-1.5 text-[12px] font-medium text-[#7891c7]">
          {organization}
        </p>
      )}

      {dateRange && (
        <p className="mt-2 text-[12px] font-medium text-[#7891c7]">
          {dateRange}
        </p>
      )}

      {description && (
        <p className="mt-3 whitespace-pre-line text-[12px] font-normal leading-5 text-white">
          {description}
        </p>
      )}
    </div>
  );
};

const PublicationItem = ({ item }: { item: PublicationItemType }) => {
  const title = getText(item.title, "N/A");
  const rawUrl = getText(item.url);
  const url = normalizeUrl(rawUrl);

  return (
    <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
      <h3 className="text-[14px] font-medium leading-tight text-white">
        {title}
      </h3>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex max-w-full items-center gap-1.5 truncate text-[12px] font-medium text-[#37e875] transition hover:underline"
        >
          <span className="truncate">{rawUrl}</span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      )}
    </div>
  );
};

const LeadershipItem = ({ item }: { item: LeadershipItemType }) => {
  const role = getText(item.role, "N/A");
  const organization = getText(item.organization);
  const dateRange = formatDateRange(item.startDate, item.endDate);
  const description = getText(item.description);

  return (
    <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
      <h3 className="text-[14px] font-medium leading-tight text-white">
        {role}
      </h3>

      {organization && (
        <p className="mt-1.5 text-[12px] font-medium text-[#37e875]">
          {organization}
        </p>
      )}

      {dateRange && (
        <p className="mt-2 text-[12px] font-medium text-[#7891c7]">
          {dateRange}
        </p>
      )}

      {description && (
        <p className="mt-3 whitespace-pre-line text-[12px] font-normal leading-5 text-white">
          {description}
        </p>
      )}
    </div>
  );
};

export default function AchievementsCard({ profile }: AchievementsCardProps) {
  const isProfessional = profile.profileType?.toLowerCase() === "professional";

  const internationalExperience = (profile.internationalExperience ||
    []) as InternationalExperienceItemType[];

  const achievements = (profile.achievements || []) as AchievementItemType[];

  const awards = (profile.awards || []) as AwardItemType[];

  const publications = (profile.publications || []) as PublicationItemType[];

  const leadership = (profile.leadership || []) as LeadershipItemType[];

  // Check if there's any data to display
  const hasInternationalExperience = internationalExperience.length > 0;
  const hasAchievements = achievements.length > 0;
  const hasAwards = awards.length > 0;
  const hasPublications = publications.length > 0;
  const hasLeadership = leadership.length > 0;

  // For professional users, show international experience if exists
  const showInternationalExperience = isProfessional && hasInternationalExperience;
  
  // For all users, show achievements, awards, publications, leadership if they have data
  const showAchievements = hasAchievements;
  const showAwards = hasAwards;
  const showPublications = hasPublications;
  const showLeadership = hasLeadership;

  // Check if there's any data to display at all
  const hasAnyData = showInternationalExperience || showAchievements || showAwards || showPublications || showLeadership;

  if (!hasAnyData) {
    return null;
  }

  // Create array of sections to display
  const sections: { id: string; component: React.ReactNode }[] = [];

  // International Experience - Only for Professional accounts with data
  if (showInternationalExperience) {
    sections.push({
      id: "international-experience",
      component: (
        <SectionCard title="International Experience" icon={Globe2}>
          {internationalExperience.map((item, index) => (
            <InternationalExperienceItem
              key={item._id || `international-${index}`}
              item={item}
            />
          ))}
        </SectionCard>
      ),
    });
  }

  // Leadership - Only if data exists
  if (showLeadership) {
    sections.push({
      id: "leadership",
      component: (
        <SectionCard title="Leadership" icon={Users}>
          {leadership.map((item, index) => (
            <LeadershipItem
              key={item._id || `leadership-${index}`}
              item={item}
            />
          ))}
        </SectionCard>
      ),
    });
  }

  // Achievements - Only if data exists
  if (showAchievements) {
    sections.push({
      id: "achievements",
      component: (
        <SectionCard title="Achievements" icon={Trophy}>
          {achievements.map((item, index) => (
            <AchievementItem
              key={item._id || `achievement-${index}`}
              item={item}
            />
          ))}
        </SectionCard>
      ),
    });
  }

  // Awards - Only if data exists
  if (showAwards) {
    sections.push({
      id: "awards",
      component: (
        <SectionCard title="Awards" icon={Award}>
          {awards.map((item, index) => (
            <AwardItem key={item._id || `award-${index}`} item={item} />
          ))}
        </SectionCard>
      ),
    });
  }

  // Publications - Only if data exists
  if (showPublications) {
    sections.push({
      id: "publications",
      component: (
        <SectionCard title="Publications" icon={BookOpen}>
          {publications.map((item, index) => (
            <PublicationItem
              key={item._id || `publication-${index}`}
              item={item}
            />
          ))}
        </SectionCard>
      ),
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {sections.map((section) => (
        <div key={section.id}>{section.component}</div>
      ))}
    </div>
  );
}