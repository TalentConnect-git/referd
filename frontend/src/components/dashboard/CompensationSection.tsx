import { CompensationSectionProps } from "@/types/dashboard";
export default function CompensationSection({ job }: CompensationSectionProps) {
  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">

      <h3 className="mb-6 text-xl font-semibold text-white">
        Compensation Details
      </h3>

      <div className="grid grid-cols-3 gap-4">

        <div className="rounded-xl bg-green-500/10 p-4">
          <p>Total Package</p>
          <p>₹ {job.packageDetails?.totalCTC || 0}</p>
        </div>

        <div className="rounded-xl bg-blue-500/10 p-4">
          <p>Fixed Pay</p>
          <p>₹ {job.packageDetails?.fixedPay || 0}</p>
        </div>

        {/* <div className="rounded-xl bg-purple-500/10 p-4">
          <p>Joining Bonus</p>
          <p>₹ {job.packageDetails?.joiningBonus || 0}</p>
        </div> */}

      </div>

       <div className="mt-8">
        <h4 className="mb-4 text-md font-semibold text-green-500">Benefits Offered</h4>
        <div className="flex flex-wrap gap-3">
          {job.benefits?.length > 0 ? (
            job.benefits.map((benefit: string, idx: number) => (
              <span key={idx} className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                {benefit}
              </span>
            ))) : 
            (
            <span className="text-gray-400">No benefits specified </span>
            )}
        </div>


      </div>
    </div>
  );
}
        