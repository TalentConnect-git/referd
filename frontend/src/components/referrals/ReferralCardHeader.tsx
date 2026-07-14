import { ReferralJob, ReferralCardHeaderProps } from '@/types/referral';
import { MapPin, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';
import ReferralDetailsOverview from './ReferralDetailsOverview';

export default function ReferralCardHeader({
  referral,
}: ReferralCardHeaderProps) {
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);

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

  const handleJobTitleClick = () => {
    if (!referral.inactive) {
      setIsOverviewModalOpen(true);
    }
  };

  return (
    <>
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
            <button
              onClick={handleJobTitleClick}
              disabled={referral.inactive}
              className={`
                text-md font-semibold 
                transition-all duration-200
                flex items-center gap-2
                ${referral.inactive 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-white hover:text-green-400 cursor-pointer group'
                }
              `}
            >
              {referral.jobTitle?.[0] || 'Untitled Position'}
              {!referral.inactive && (
                <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-green-400" />
              )}
            </button>

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

      {/* Overview Modal */}
      {isOverviewModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setIsOverviewModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a2332] border border-[#2a3a52] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-[#2a3a52] bg-[#1a2332]/95 backdrop-blur-sm rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {referral.jobTitle?.[0] || 'Untitled Position'}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{getLocation()}</span>
                </div>
              </div>
              <button
                onClick={() => setIsOverviewModalOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              <ReferralDetailsOverview referral={referral} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}