interface DashboardProfStatsProps {
    referralsPosted: number;
    applicationsReceived: number;
    responseRate: number;
    successRate: number;
}



export default function DashboardProfStats({referralsPosted, applicationsReceived, responseRate, successRate }: DashboardProfStatsProps) 
{
    return (
   
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 px-3">
     <div className="rounded-xl border border-gray-800 bg-[#0f172a] p-4">
        <h3 className="text-sm text-gray-400 uppercase">Referrals Posted</h3>
        <p className="mt-4 text-2xl font-bold text-white">{referralsPosted}</p>
      </div>

      <div className="rounded-xl border border-gray-800 bg-[#0f172a] p-4">
        <h3 className="text-sm text-gray-400 uppercase">Applications Received</h3>
        <p className="mt-4 text-2xl font-bold text-white">{applicationsReceived}</p>
      </div>

      <div className="rounded-xl border border-gray-800 bg-[#0f172a] p-4">
        <h3 className="text-sm text-gray-400 uppercase">Response Rate </h3>
        <p className="mt-4 text-2xl font-bold text-white">{responseRate}</p>
      </div>

      <div className="rounded-xl border border-gray-800 bg-[#0f172a] p-4">
        <h3 className="text-sm text-gray-400 uppercase">Success Rate </h3>
        <p className="mt-4 text-2xl font-bold text-white">{successRate}%</p>
        </div>

    </div>

  );
}