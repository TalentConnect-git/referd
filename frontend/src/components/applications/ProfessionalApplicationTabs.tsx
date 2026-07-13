"use client";

import { ProfessionalApplicationType } from "@/types/applications";
import { ProfessionalApplicationTabsProps } from "@/types/applications";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ProfessionalApplicationTabs({
  activeTab,
  onChange,
}: ProfessionalApplicationTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const tabs: ProfessionalApplicationType[] = [
    "Requests Received",
    "Applications By Me",
    "Referred By Me"
  ];

  // Check if tab parameter exists in URL and set it
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam && tabs.includes(tabParam as ProfessionalApplicationType)) {
      onChange(tabParam as ProfessionalApplicationType);
    }
  }, [searchParams, onChange]);

  const handleTabChange = (tab: ProfessionalApplicationType) => {
    // Update URL with tab parameter
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('tab', tab);
    router.push(`?${params.toString()}`, { scroll: false });
    onChange(tab);
  };

  return (
    <div className="flex mb-4 gap-6  rounded-t-xl px-4 pt-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabChange(tab)}
          className={`
            relative
            pb-2.5
            text-sm
            font-semibold
            transition-all
            duration-300
            ease-in-out
            ${
              activeTab === tab
                ? "text-green-500"
                : "text-slate-400 hover:text-slate-300"
            }
          `}
        >
          {tab}
          
          {/* Active indicator bar */}
          <span
            className={`
              absolute
              -bottom-[1px]
              left-0
              h-0.5
              rounded-full
              bg-gradient-to-r
              from-green-500
              to-emerald-500
              transition-all
              duration-300
              ease-in-out
              ${
                activeTab === tab
                  ? "w-full"
                  : "w-0"
              }
            `}
          />
        </button>
      ))}
    </div>
  );
}