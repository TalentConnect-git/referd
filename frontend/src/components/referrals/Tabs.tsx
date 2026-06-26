// components/referrals/Tabs.tsx
"use client";

import { Briefcase, Users } from "lucide-react";

export type TabType = "all-jobs" | "alumni-results";

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: "all-jobs" as TabType,
      label: "All Referral Jobs",
      icon: Briefcase,
    },
    {
      id: "alumni-results" as TabType,
      label: "Alumni Found",
      icon: Users,
    },
  ];

  return (
    <div className="border-b border-[var(--border)]">
      <nav className="flex gap-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-1 py-4 text-sm font-semibold transition-all ${
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};