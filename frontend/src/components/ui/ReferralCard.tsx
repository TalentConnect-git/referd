import { CheckCircle, MapPin, Building2, Briefcase, GraduationCap, DollarSign } from "lucide-react";

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
    <div className="surface-card group rounded-2xl p-5 transition-all duration-300 hover:border-[var(--primary-border)] hover:shadow-md">
      {/* Header: company logo + title */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--primary-soft)] text-sm font-semibold text-[var(--primary)] transition-all duration-300 group-hover:border-[var(--primary-border)] group-hover:shadow-sm">
          {companyLogo}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold leading-5 text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary)]">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-1.5">
            <Building2 className="h-3 w-3 text-[var(--text-muted)]" />
            <p className="truncate text-xs text-[var(--text-secondary)]">
              {company}
            </p>
            <span className="text-[var(--border)]">·</span>
            <MapPin className="h-3 w-3 text-[var(--text-muted)]" />
            <p className="truncate text-xs text-[var(--text-secondary)]">
              {location}
            </p>
          </div>
        </div>
      </div>

      {/* Salary + Match */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
          
            Total CTC
          </p>
          <p className="mt-0.5 text-base font-bold tracking-[-0.02em] text-[var(--text-primary)]">
            {salary || "—"}
          </p>
        </div>
        
        {/* Match badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)] px-3 py-1.5">
          <span className="text-[10px] font-semibold text-[var(--primary)]">
            {match}
          </span>
          <span className="text-[9px] text-[var(--primary)]/60">match</span>
        </div>
      </div>

      <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

      {/* Footer: posted-by */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[10px] font-semibold text-[var(--primary)]">
            {postedByInitials}
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary)]">
              {postedByName}
            </p>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={12} className="text-[var(--primary)]" />
              <span className="text-[10px] font-medium text-[var(--primary)]">
                Referral available
              </span>
            </div>
          </div>
        </div>

        {/* College info */}
        {college && (
          <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
            <GraduationCap className="h-3 w-3" />
            <span className="max-w-[100px] truncate">{college}</span>
          </div>
        )}
      </div>
    </div>
  );
}