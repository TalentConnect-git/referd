import type { ApplicationType } from "@/types/applications";
import { ApplicationTabsProps } from "@/types/applications";
export default function ApplicationTabs({activeTab,onChange}:ApplicationTabsProps)
{
    const tabs:ApplicationType[] = ["Referral","Internship","Off-campus"];
    return (

<div className="flex gap-8 border-b border-slate-800">
  {tabs.map((tab) => (
    <button
      key={tab}
      onClick={() => onChange(tab)}
      className={`pb-3 text-lg font-medium transition-colors ${
        activeTab === tab
          ? "text-green-500 border-b-2 border-green-500"
          : "text-gray-400"
      }`}
    >
      {tab}
    </button>
  ))}
</div>

  );
}