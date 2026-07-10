import {ReferralJob} from '@/types/referral'
import ReferralCardHeader from './ReferralCardHeader';
import ReferralStats from './ReferralStats';
import ReferralActions from './ReferralActions';
import { ReferralCardProps } from '@/types/referral';


export default function ReferralCard({
  referral,onViewDetails,handleDelete,onPause
}: ReferralCardProps) {

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 ml-0 mr-0 mt-2 mb-3">
      <ReferralCardHeader referral={referral} />

      <ReferralStats metrics={referral.metrics} onViewDetails={onViewDetails} />

      <ReferralActions referral={referral} onViewDetails={onViewDetails} handleDelete={handleDelete} inactive={referral.inactive} onPause={onPause} />
    </div>
  );
}




