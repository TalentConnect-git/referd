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
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-white/5 text-[14px] font-semibold text-white">
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

        <span className="rounded-full bg-[var(--primary-soft)] px-2.5 py-1 font-mono text-[11px] text-[var(--primary)]">
          {match}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-[11px] text-[var(--text-primary)]">
          Posted by
        </p>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[10px] font-medium text-[var(--primary)]">
            {postedByInitials}
          </div>

          <p className="text-[13px] text-white">
            {postedByName}
            <span className="text-[var(--text-primary)]">
              {" "}
              · {college}
            </span>
          </p>
        </div>
      </div>

      <div className="my-5 h-px w-full bg-[var(--border)]" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--primary)]">
          <CheckCircle size={14} />
          Referral available
        </div>

        <p className="text-[12px] text-[var(--text-primary)]">
          {salary}
        </p>
      </div>
    </div>
  );
}