import { CompensationSectionProps } from "@/types/dashboard";

export default function CompensationSection({ job }: CompensationSectionProps) {
  return (
    <div className="surface-card rounded-lg p-4">
      <h3 className="mb-3 text-base font-semibold text-[var(--text-primary)]">
        Compensation Details
      </h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-[var(--success-soft)] p-3 border border-[var(--success-border)]">
          <p className="text-xs text-[var(--text-muted)]">Total Package</p>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            ₹ {job.packageDetails?.totalCTC || 0}
          </p>
        </div>

        <div className="rounded-lg bg-[var(--info-soft)] p-3 border border-[var(--info-border)]">
          <p className="text-xs text-[var(--text-muted)]">Fixed Pay</p>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            ₹ {job.packageDetails?.fixedPay || 0}
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-[var(--border)] pt-3">
        <p className="mb-2 text-xs font-medium text-[var(--primary)]">
          Benefits Offered
        </p>
        <div className="flex flex-wrap gap-2">
          {job.benefits?.length > 0 ? (
            job.benefits.map((benefit: string, idx: number) => (
              <span 
                key={idx} 
                className="badge badge-info"
              >
                {benefit}
              </span>
            ))
          ) : (
            <span className="text-xs text-[var(--text-muted)]">
              No benefits specified
            </span>
          )}
        </div>
      </div>
    </div>
  );
}