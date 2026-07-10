import { CheckCircle } from "lucide-react";

type ReferralCardProps = {
  companyLogo: string;
  title: string;
  company: string;
  location: string;
  match: string;
  postedByInitials: string;
  postedByName: string;
  college: string;
  salary: string;
};

export default function ReferralCard({
  companyLogo,
  title,
  company,
  location,
  match,
  postedByInitials,
  postedByName,
  college,
  salary,
}: ReferralCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/70 p-5">
      {/* Header: company logo + title — no match badge here anymore */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-white/5 text-[14px] font-semibold text-white">
          {companyLogo}
        </div>

        <div>
          <h3 className="text-[15px] font-semibold leading-5 text-white">
            {title}
          </h3>
          <p className="mt-0.5 text-[12px] text-[var(--text-primary)]">
            {company} · {location}
          </p>
        </div>
      </div>

      {/* Salary — primary value, large and prominent */}
      <div className="mt-5">
        <p className="text-[11px] text-[var(--text-primary)]">Total CTC</p>
        <p className="mt-1 text-[20px] font-bold tracking-[-0.02em] text-white">
          {salary || "—"}
        </p>
      </div>

      <div className="my-4 h-px w-full bg-[var(--border)]" />

      {/* Footer: posted-by on left, match % demoted to right as small label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[10px] font-medium text-[var(--primary)]">
            {postedByInitials}
          </div>

          <div>
            <p className="text-[12px] font-medium text-white">{postedByName}</p>
            <div className="flex items-center gap-1 font-mono text-[10px] text-[var(--primary)]">
              <CheckCircle size={11} />
              Referral available
            </div>
          </div>
        </div>

        {/* Match % — demoted: small, muted, secondary position */}
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-primary)]">
          {match} match
        </span>
      </div>
    </div>
  );
}
