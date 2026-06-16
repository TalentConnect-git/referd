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
        className="px-3 py-2 border rounded-md disabled:opacity-50"
      >
        Previous
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        disabled={!hasNext}
        onClick={onNext}
        className="px-3 py-2 border rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}