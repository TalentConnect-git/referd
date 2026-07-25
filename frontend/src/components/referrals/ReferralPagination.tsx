import { ReferralPaginationProps } from "@/types/referral";

export default function ReferralPagination({
  page,
  totalPages,
  hasNext,
  hasPrev,
  onPrevious,
  onNext,
}: ReferralPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <button
        disabled={!hasPrev}
        onClick={onPrevious}
        className="btn-secondary px-3 py-2 border border-theme rounded-md text-sm font-medium text-primary hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Previous
      </button>

      <span className="text-sm text-secondary">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={!hasNext}
        onClick={onNext}
        className="btn-secondary px-3 py-2 border border-theme rounded-md text-sm font-medium text-primary hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Next
      </button>
    </div>
  );
}