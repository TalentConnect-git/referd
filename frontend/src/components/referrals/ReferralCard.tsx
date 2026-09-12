import { ReferralJob } from '@/types/referral'
import ReferralCardHeader from './ReferralCardHeader';
import ReferralStats from './ReferralStats';
import ReferralActions from './ReferralActions';
import { ReferralCardProps } from '@/types/referral';
import { getReferralDisplayStatus } from '@/utils/referralStatus';

export default function ReferralCard({
  referral, onViewDetails, handleDelete, onPause
}: ReferralCardProps) {
  const status = getReferralDisplayStatus(referral);

  return (
    <div className="card rounded-xl border border-theme bg-card p-3 ml-0 mr-0 mt-2 mb-3">
      <ReferralCardHeader referral={referral} />

      <ReferralStats metrics={referral.metrics} onViewDetails={onViewDetails} />

      <ReferralActions
        referral={referral}
        onViewDetails={onViewDetails}
        handleDelete={handleDelete}
        inactive={referral.inactive}
        status={status}
        onPause={onPause}
      />
    </div>
  );
}