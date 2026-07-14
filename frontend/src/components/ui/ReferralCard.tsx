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
    <div className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/70 p-5 transition-all duration-300 hover:border-green-500/30 hover:bg-[var(--card)] hover:shadow-lg hover:shadow-green-500/5">
      {/* Header: company logo + title */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-[14px] font-semibold text-white transition-all duration-300 group-hover:border-green-500/30 group-hover:shadow-lg group-hover:shadow-green-500/10">
          {companyLogo}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold leading-5 text-white group-hover:text-green-400 transition-colors truncate">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-1.5">
            <Building2 className="w-3 h-3 text-[var(--text-muted)]" />
            <p className="text-[12px] text-[var(--text-primary)] truncate">
              {company}
            </p>
            <span className="text-[var(--border)]">·</span>
            <MapPin className="w-3 h-3 text-[var(--text-muted)]" />
            <p className="text-[12px] text-[var(--text-primary)] truncate">
              {location}
            </p>
          </div>
        </div>
      </div>

      {/* Salary — reduced font size, cleaner layout */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
           
            Total CTC
          </p>
          <p className="mt-0.5 text-[16px] font-bold tracking-[-0.02em] text-white">
            {salary || "—"}
          </p>
        </div>
        
        {/* Match % — promoted to a cleaner badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 border border-green-500/20">
          <span className="text-[10px] font-semibold text-green-400">
            {match}
          </span>
          <span className="text-[9px] text-green-400/60">match</span>
        </div>
      </div>

      <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

      {/* Footer: posted-by with enhanced design */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-[10px] font-semibold text-green-400 border border-green-500/20">
            {postedByInitials}
          </div>

          <div>
            <p className="text-[12px] font-medium text-white group-hover:text-green-400 transition-colors">
              {postedByName}
            </p>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={12} className="text-green-400" />
              <span className="text-[10px] text-green-400 font-medium">
                Referral available
              </span>
            </div>
          </div>
        </div>

        {/* College info - subtle */}
        {college && (
          <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
            <GraduationCap className="w-3 h-3" />
            <span className="truncate max-w-[100px]">{college}</span>
          </div>
        )}
      </div>
    </div>
  );
}