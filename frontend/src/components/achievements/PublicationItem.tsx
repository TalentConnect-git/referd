// components/achievements/PublicationItem.tsx
"use client";

import { ExternalLink } from "lucide-react";
import { PublicationItemType } from "@/types/achievements";
import { getText, normalizeUrl } from "@/lib/achievements-utils";

interface PublicationItemProps {
  item: PublicationItemType;
}

export default function PublicationItem({ item }: PublicationItemProps) {
  const title = getText(item.title, "N/A");
  const rawUrl = getText(item.url);
  const url = normalizeUrl(rawUrl);

  return (
    <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
      <h3 className="text-[14px] font-medium leading-tight text-white">
        📄 {title}
      </h3>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex max-w-full items-center gap-1.5 truncate text-[12px] font-medium text-[#37e875] transition hover:underline"
        >
          <span className="truncate">🔗 {rawUrl}</span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      )}
    </div>
  );
}