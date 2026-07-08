// components/career/SkillCategoryCard.tsx

import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';

interface SkillCategoryCardProps {
  title: string;
  skills: string[];
  icon: 'high' | 'growing' | 'saturated' | 'obsolete';
  color: string;
}

const iconMap = {
  high: { icon: Zap, color: 'text-[#38e878]' },
  growing: { icon: TrendingUp, color: 'text-[#e8d838]' },
  saturated: { icon: Minus, color: 'text-[#e8a838]' },
  obsolete: { icon: TrendingDown, color: 'text-[#e83838]' }
};

export default function SkillCategoryCard({
  title,
  skills,
  icon,
  color
}: SkillCategoryCardProps) {
  const { icon: Icon, color: iconColor } = iconMap[icon];

  if (skills.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#1a2533] bg-[#0d1520] p-4 transition-all hover:border-[#2a3a4a]">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <h4 className="text-[14px] font-semibold text-white">{title}</h4>
        <span className="ml-auto text-[12px] text-[#64748b]">{skills.length} skills</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="rounded-full bg-[#12381f] px-2.5 py-1 text-[12px] text-[#38e878]"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}