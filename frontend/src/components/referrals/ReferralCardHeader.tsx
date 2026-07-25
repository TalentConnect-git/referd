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
              ? 'bg-background-soft/50 text-muted border border-theme/50' 
              : 'bg-primary-soft text-primary border border-primary/20 hover:scale-105'
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
                  ? 'text-muted cursor-not-allowed' 
                  : 'text-primary hover:text-primary group'
                }
              `}
            >
              {referral.jobTitle?.[0] || 'Untitled Position'}
              {!referral.inactive && (
                <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary" />
              )}
            </button>

            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted" />
              <p className="text-muted text-[10px]">
                {getLocation()}
              </p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex gap-2">
          <span
            className={`
              badge
              rounded-full px-3 py-0.5 
              text-[11px] font-medium 
              border 
              transition-all duration-200
              flex items-center gap-1.5
              ${referral.inactive
                ? 'border-theme text-muted bg-background-soft hover:bg-card-hover'
                : 'badge-success hover:border-success/50'
              }
            `}
          >
            {/* Status Dot */}
            <span className={`
              inline-block w-1.5 h-1.5 rounded-full
              ${referral.inactive 
                ? 'bg-muted' 
                : 'bg-success animate-pulse'
              }
            `} />
            {referral.inactive ? 'Closed' : 'Live'}
          </span>
        </div>
      </div>

      {/* Overview Modal */}
      {isOverviewModalOpen && (
        <div 
          className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-sm p-4"
          onClick={() => setIsOverviewModalOpen(false)}
        >
          <div 
            className="modal-content relative w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-theme rounded-2xl shadow-xl bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-divider bg-card/95 backdrop-blur-sm rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-primary">
                  {referral.jobTitle?.[0] || 'Untitled Position'}
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{getLocation()}</span>
                </div>
              </div>
              <button
                onClick={() => setIsOverviewModalOpen(false)}
                className="btn-ghost p-2 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-primary"
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