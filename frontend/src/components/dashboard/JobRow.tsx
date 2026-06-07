"use client";

type JobRowProps = {
  id: string;
  logoLetter: string;
  title: string;
  company: string;
  location: string;
  referredBy: string;
  matchScore: number;
};

export default function JobRow({
  id,
  logoLetter,
  title,
  company,
  location,
  referredBy,
  matchScore,
}: JobRowProps) {
  const handleSave = () => {
    console.log("Save job:", id);
  };

  const handleApply = () => {
    console.log("Apply job:", id);
  };

  return (
    <div className="flex items-center justify-between border-b border-[#1e293b] px-5 py-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#334155] bg-[#1e293b] text-sm font-bold text-white">
          {logoLetter || "J"}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold text-white">
              {title}
            </h3>

            {matchScore > 0 && (
              <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] text-green-400">
                {matchScore}% match
              </span>
            )}
          </div>

          <p className="mt-1 truncate text-sm text-[#bfdbfe]">
            {company} · {location} · ref by {referredBy}
          </p>
        </div>
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-3">
        <button
          onClick={handleSave}
          className="rounded-lg border border-[#334155] bg-[#1e293b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#263449]"
        >
          Save
        </button>

        <button
          onClick={handleApply}
          className="rounded-lg bg-[#2eba47] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#27a83f]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}