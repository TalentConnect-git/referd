import { BadgeCheck, LayoutDashboard, ShieldCheck } from "lucide-react";
import Link from "next/link";

const items = [
  {
    icon: <BadgeCheck size={16} />,
    title: "Access Verified Alumni",
    text: "Connect with verified students, freshers, and professionals.",
  },
  {
    icon: <LayoutDashboard size={16} />,
    title: "Manage Everything",
    text: "Track referrals, applications, and profile from one dashboard.",
  },
  {
    icon: <ShieldCheck size={16} />,
    title: "Secure & Trusted",
    text: "Built with secure authentication and verified profiles.",
  },
];

export default function SignupInfoPanel() {
  return (
    <div className="hidden w-[40%] rounded-l-3xl bg-[var(--card)] px-9 py-8 lg:block">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(49,170,64,0.35)] bg-[var(--primary-soft)]">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
        </div>

        <span className="text-[13px] font-bold tracking-tight text-white">
          Referd<span className="text-[var(--primary)]">.</span>
        </span>
      </Link>

      <p className="mt-9 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--primary)]">
        Create Account
      </p>

      <h1 className="mt-4 max-w-[280px] text-[24px] font-bold leading-tight tracking-[-0.04em] text-white">
        Start your referral journey today
      </h1>

      <div className="mt-10 space-y-7">
        {items.map((item) => (
          <div key={item.title} className="flex gap-3">
            <div className="mt-[2px] text-[var(--primary)]">{item.icon}</div>

            <div>
              <h3 className="text-[13px] font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-1 max-w-[240px] text-[11px] leading-5 text-[var(--text-primary)]">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 h-px w-full bg-[var(--border)]" />

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-primary)]">
        Alumni Referral Network
      </p>
    </div>
  );
}




