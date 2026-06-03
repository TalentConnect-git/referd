import { Briefcase, CheckCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

const items = [
  {
    icon: <CheckCircle size={16} />,
    title: "Access Your Dashboard",
    text: "Manage referrals and applications.",
  },
  {
    icon: <Briefcase size={16} />,
    title: "Continue Your Journey",
    text: "Pick up right where you left off.",
  },
  {
    icon: <ShieldCheck size={16} />,
    title: "Secure & Reliable",
    text: "Protected with secure authentication.",
  },
];

export default function LoginInfoPanel() {
  return (
    <div className="hidden w-[40%] rounded-l-3xl bg-[var(--card)] px-9 py-8 lg:block">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(49,170,64,0.35)] bg-[var(--primary-soft)]">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
        </div>

        <span className="text-[13px] font-bold tracking-tight text-white">
          Referd
          <span className="text-[var(--primary)]">.</span>
        </span>
      </Link>

      <h1 className="mt-10 text-[24px] font-bold tracking-[-0.04em] text-white">
        Welcome Back
      </h1>

      <p className="mt-3 max-w-[260px] text-[13px] leading-6 text-[var(--text-primary)]">
        Continue your referral or hiring journey seamlessly.
      </p>

      <div className="mt-10 space-y-7">
        {items.map((item) => (
          <div key={item.title} className="flex gap-3">
            <div className="mt-[2px] text-[var(--primary)]">
              {item.icon}
            </div>

            <div>
              <h3 className="text-[13px] font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-1 max-w-[230px] text-[11px] leading-5 text-[var(--text-primary)]">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 h-px w-full bg-[var(--border)]" />

      <p className="mt-6 font-mono text-[10px] text-[var(--text-primary)]">
        Alumni Referral Network
      </p>
    </div>
  );
}