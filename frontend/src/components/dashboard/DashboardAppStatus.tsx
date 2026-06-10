import AppStatusRow from './AppStatusRow';
interface DashboardAppStatusProps {
  applications:any[];
}
export default function DashboardAppStatus({ applications }: DashboardAppStatusProps) {
  return (
    <div className="rounded-3xl border border-[#1e293b] bg-[#0f172a] min-h-[500px] mr-5">

      <div className="p-4 border-b border-[#1e293b]">

        <h2 className="text-xl font-semibold text-white">
          Application Status
        </h2>

        <p className="text-gray-400 text-md">
          Recent application updates
        </p>

      </div>

      <div>
        {
         applications.length>0 ? ( applications.map((application) => (
  <AppStatusRow
    key={application._id}
    company={application.displayCompanyName ?? "Company"}
    role={
      application.jobDetails?.jobTitle?.[0] ??
      application.jobDetails?.jobRoles?.[0] ??
      "Untitled Job"
    }
    stage={application.currentStatus}
  />
))): ( <p className="p-4 text-gray-400">No applications found</p>)
}
      </div>

    </div>
  );
}