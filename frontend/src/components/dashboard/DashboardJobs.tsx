import JobRow from './JobRow';
interface DashboardJobsProps{
  jobs:any[];
} 
export default async function DashboardJobs({ jobs }: DashboardJobsProps) 
{
    // const response = await fetch("http://localhost:5000/api/student-dashboard/job-postings");
    // const jobs = await response.json();
  return (

    
    <div className="rounded-2xl border border-[#1e293b] bg-[#0f172a] min-h-[500px] ml-5">

      <div className="flex text-pink-700 items-center justify-between p-3 border-b border-[#1e293b]">

        <div>
          <h2 className="text-lg font-semibold text-white">
            Jobs For You
          </h2>

          <p className="text-gray-400 text-sm">
            Ranked by our matching engine
          </p>
        </div>

        <button className="text-gray-400 hover:text-white">
          View All →
        </button>

      </div>
      <div>
        <div>
        { jobs.length > 0 ? (jobs.map((job) => (
                <JobRow id={job._id} title={job.jobTitle} location={job.location} type={job.jobType} />
                ))) : ( <p className="p-4 text-gray-400">No jobs found</p>)
                }
      </div>
      </div>

    </div>
  );
}
