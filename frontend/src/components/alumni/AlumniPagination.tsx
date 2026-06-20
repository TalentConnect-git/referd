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
    <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#111821] p-4 sm:flex-row">
      <p className="text-sm text-slate-400">
        Showing{" "}
        <span className="font-semibold text-white">{currentCount}</span> of{" "}
        <span className="font-semibold text-white">{totalCount}</span> alumni
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || loading}
          className="flex h-10 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300">
          Page <span className="font-semibold text-white">{page}</span> of{" "}
          <span className="font-semibold text-white">{totalPages}</span>
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || loading}
          className="flex h-10 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}


