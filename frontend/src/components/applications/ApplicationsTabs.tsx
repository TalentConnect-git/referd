import type { ApplicationType } from "@/types/applications";
import { ApplicationTabsProps } from "@/types/applications";

export default function ApplicationTabs({ activeTab, onChange }: ApplicationTabsProps) {
  const tabs: ApplicationType[] = ["Referral", "Internship", "Off-campus"];

  return (
    <div className="flex gap-6 border-b border-theme bg-background/50 rounded-t-xl px-4 pt-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
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
                ? "text-success"
                : "text-muted hover:text-secondary"
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
              from-success
              to-success-light
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