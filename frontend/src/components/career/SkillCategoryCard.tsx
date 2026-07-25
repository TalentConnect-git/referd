// components/career/SkillCategoryCard.tsx

import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';

interface SkillCategoryCardProps {
  title: string;
  skills: string[];
  icon: 'high' | 'growing' | 'saturated' | 'obsolete';
  color: string;
}

const iconMap = {
  high: { icon: Zap, color: 'text-success' },
  growing: { icon: TrendingUp, color: 'text-warning' },
  saturated: { icon: Minus, color: 'text-orange-400' },
  obsolete: { icon: TrendingDown, color: 'text-danger' }
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
    <div className="card rounded-xl border border-theme bg-card-soft p-4 transition-all hover:border-strong">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <h4 className="text-[14px] font-semibold text-primary">{title}</h4>
        <span className="ml-auto text-[12px] text-muted">{skills.length} skills</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="badge badge-success rounded-full px-2.5 py-1 text-[12px]"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}