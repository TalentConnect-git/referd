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
    bg: 'bg-success-soft',
    fill: 'bg-success',
    text: 'text-success'
  },
  red: {
    bg: 'bg-danger-soft',
    fill: 'bg-danger',
    text: 'text-danger'
  },
  yellow: {
    bg: 'bg-warning-soft',
    fill: 'bg-warning',
    text: 'text-warning'
  },
  blue: {
    bg: 'bg-info-soft',
    fill: 'bg-info',
    text: 'text-info'
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
        <span className="text-[13px] font-medium text-secondary">{label}</span>
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