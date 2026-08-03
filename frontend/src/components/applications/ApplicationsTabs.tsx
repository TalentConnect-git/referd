import type { ApplicationType } from "@/types/applications";
import { ApplicationTabsProps } from "@/types/applications";

export default function ApplicationTabs({ activeTab, onChange }: ApplicationTabsProps) {
  const tabs: ApplicationType[] = ["Referral", "Internship", "Off-campus"];

  return (
    <div className="flex gap-6  px-6 pt-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`
            relative
            pb-3
            text-base
            font-semibold
            transition-all
            duration-300
            ease-in-out
            ${
              activeTab === tab
                ? "text-[var(--primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
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
              bg-[var(--primary)]
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