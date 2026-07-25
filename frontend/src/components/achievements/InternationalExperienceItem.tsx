// components/achievements/InternationalExperienceItem.tsx
"use client";

import { ExternalLink } from "lucide-react";
import { InternationalExperienceItemType } from "@/types/achievements";
import {
  getText,
  normalizeUrl,
  formatDateRange,
} from "@/lib/achievements-utils";

interface InternationalExperienceItemProps {
  item: InternationalExperienceItemType;
}

export default function InternationalExperienceItem({
  item,
}: InternationalExperienceItemProps) {
  const title = getText(item.role, "N/A");
  const country = getText(item.country);
  const organization = getText(item.organization);
  const dateRange = formatDateRange(item.startDate, item.endDate);
  const description = getText(item.description);
  const certificateUrl = normalizeUrl(item.certificate);

  return (
    <div className="card rounded-[12px] border border-theme/10 bg-card-soft px-4 py-4">
      {/* Organization/Company Name - Top */}
      {organization && (
        <p className="text-[14px] font-medium leading-tight text-primary">
          {organization}
        </p>
      )}

      {/* Role - Below Organization in Green */}
      <h3 className="mt-1.5 text-[12px] font-medium text-success">
        {title}
      </h3>

      {/* Country */}
      {country && (
        <p className="mt-1.5 text-[12px] font-medium text-muted">
          🌍 {country}
        </p>
      )}

      {/* Date Range */}
      {dateRange && (
        <p className="mt-1.5 text-[12px] font-medium text-muted">
          📅 {dateRange}
        </p>
      )}

      {/* Description */}
      {description && (
        <p className="mt-3 whitespace-pre-line text-[12px] font-normal leading-5 text-primary">
          {description}
        </p>
      )}

      {/* Certificate Link */}
      {certificateUrl && (
        <a
          href={certificateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-success transition hover:underline"
        >
          View Certificate
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}