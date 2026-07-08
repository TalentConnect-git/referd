// components/career/ProgressBar.tsx

interface ProgressBarProps {
  label: string;
  value: number;
  color: 'green' | 'red' | 'yellow' | 'blue';
  maxValue?: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  green: {
    bg: 'bg-[#12381f]',
    fill: 'bg-[#38e878]',
    text: 'text-[#38e878]'
  },
  red: {
    bg: 'bg-[#3d1a1a]',
    fill: 'bg-[#e83838]',
    text: 'text-[#e83838]'
  },
  yellow: {
    bg: 'bg-[#3d3a1a]',
    fill: 'bg-[#e8d838]',
    text: 'text-[#e8d838]'
  },
  blue: {
    bg: 'bg-[#1a2a3d]',
    fill: 'bg-[#3898e8]',
    text: 'text-[#3898e8]'
  }
};

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5'
};

export default function ProgressBar({
  label,
  value,
  color,
  maxValue = 100,
  showPercentage = true,
  size = 'md'
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  const colors = colorMap[color];
  const height = sizeMap[size];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#cbd5e1]">{label}</span>
        {showPercentage && (
          <span className={`text-[13px] font-semibold ${colors.text}`}>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className={`w-full overflow-hidden rounded-full ${colors.bg} ${height}`}>
        <div
          className={`rounded-full transition-all duration-700 ease-out ${colors.fill} ${height}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}