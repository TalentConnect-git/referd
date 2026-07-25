"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type AlumniPaginationProps = {
  page: number;
  totalPages: number;
  loading?: boolean;
  onPageChange: (newPage: number) => void;
  currentCount: number;
  totalCount: number;
};

export function AlumniPagination({
  page,
  totalPages,
  loading = false,
  onPageChange,
  currentCount,
  totalCount,
}: AlumniPaginationProps) {
  return (
    <div className="card mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-theme bg-card-soft p-4 sm:flex-row">
      <p className="text-sm text-muted">
        Showing{" "}
        <span className="font-semibold text-primary">{currentCount}</span> of{" "}
        <span className="font-semibold text-primary">{totalCount}</span> alumni
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || loading}
          className="btn-secondary flex h-10 items-center gap-2 rounded-xl border border-theme px-4 text-sm font-semibold text-primary transition hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="badge rounded-xl border border-theme px-4 py-2 text-sm text-secondary">
          Page <span className="font-semibold text-primary">{page}</span> of{" "}
          <span className="font-semibold text-primary">{totalPages}</span>
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || loading}
          className="btn-secondary flex h-10 items-center gap-2 rounded-xl border border-theme px-4 text-sm font-semibold text-primary transition hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}