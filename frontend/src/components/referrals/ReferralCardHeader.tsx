import { ReferralJob, ReferralCardHeaderProps } from '@/types/referral';
import { MapPin } from 'lucide-react';

export default function ReferralCardHeader({
  referral,
}: ReferralCardHeaderProps) {
  // Get initials from job title
  const getInitials = (title: string) => {
    if (!title) return '📋';
    return title
      .split(' ')
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Get location display
  const getLocation = () => {
    if (referral.location?.[0]) return referral.location[0];
    
    return 'Remote';
  };

  return (
    <div className="flex items-start justify-between">
      <div className="flex gap-3">
        {/* Enhanced Avatar */}
        <div className={`
          h-12 w-12 rounded-xl 
          flex items-center justify-center 
          text-lg font-bold
          transition-all duration-300
          ${referral.inactive 
            ? 'bg-gray-800/50 text-gray-500 border border-gray-700/50' 
            : 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/20 hover:scale-105'
          }
        `}>
          {getInitials(referral.jobTitle?.[0])}
        </div>

        {/* Job Info */}
        <div className="space-y-0.5">
          <h3 className={`
            text-md font-semibold 
            transition-colors duration-200
            ${referral.inactive 
              ? 'text-gray-400' 
              : 'text-white hover:text-green-400'
            }
          `}>
            {referral.jobTitle?.[0] || 'Untitled Position'}
          </h3>

          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gray-500" />
            <p className="text-muted-foreground text-[10px]">
              {getLocation()}
            </p>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex gap-2">
        <span
          className={`
            rounded-full px-3 py-0.5 
            text-[11px] font-medium 
            border 
            transition-all duration-200
            flex items-center gap-1.5
            ${referral.inactive
              ? 'border-gray-600 text-gray-400 bg-gray-900/40 hover:bg-gray-900/60'
              : 'border-green-500/30 text-green-400 bg-green-900/20 hover:bg-green-900/30 hover:border-green-500/50'
            }
          `}
        >
          {/* Status Dot */}
          <span className={`
            inline-block w-1.5 h-1.5 rounded-full
            ${referral.inactive 
              ? 'bg-gray-500' 
              : 'bg-green-400 animate-pulse'
            }
          `} />
          {referral.inactive ? 'Closed' : 'Live'}
        </span>
      </div>
    </div>
  );
}