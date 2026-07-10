import { CompensationSectionProps } from "@/types/dashboard";

export default function CompensationSection({ job }: CompensationSectionProps) {
  return (
    <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-4">
      <h3 className="mb-3 text-base font-semibold text-white">
        Compensation Details
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-green-500/10 p-3">
          <p className="text-xs text-gray-400">Total Package</p>
          <p className="text-sm font-medium text-white">₹ {job.packageDetails?.totalCTC || 0}</p>
        </div>

        <div className="rounded-lg bg-blue-500/10 p-3">
          <p className="text-xs text-gray-400">Fixed Pay</p>
          <p className="text-sm font-medium text-white">₹ {job.packageDetails?.fixedPay || 0}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#1e293b]">
        <p className="mb-2 text-xs font-medium text-green-400">Benefits Offered</p>
        <div className="flex flex-wrap gap-2">
          {job.benefits?.length > 0 ? (
            job.benefits.map((benefit: string, idx: number) => (
              <span 
                key={idx} 
                className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-300"
              >
                {benefit}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No benefits specified</span>
          )}
        </div>
      </div>
    </div>
  );
}