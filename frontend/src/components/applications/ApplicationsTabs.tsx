import type { ApplicationType } from "@/types/applications";
import { ApplicationTabsProps } from "@/types/applications";

export default function ApplicationTabs({ activeTab, onChange }: ApplicationTabsProps) {
  const tabs: ApplicationType[] = ["Referral", "Internship", "Off-campus"];

  return (
    <div className="flex gap-6 border-b border-[#2a3a52] bg-[#0f172a]/50 rounded-t-xl px-4 pt-3">
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