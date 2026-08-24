// app/trending-jobs/page.tsx (or wherever you want to display)
import TrendingJobs from '@/components/home/TrendingJobs';

export default function TrendingJobsPage() {
  return (
    <div className="responsive-page-container py-6">
      
      <TrendingJobs />
    </div>
  );
}