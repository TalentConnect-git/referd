import { Briefcase, CheckCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/icon.png";

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
      <Link href="/" className="flex items-center gap-0.5 group">
        {/* Logo Image */}
        <div className="relative h-6 w-6 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
          <Image
            src={logo}
            alt="Referd Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Text with dot */}
        <span className="text-lg font-medium tracking-tight text-white transition-colors duration-200 group-hover:text-[var(--primary)]">
          referd
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
            <div className="mt-[2px] text-[var(--primary)]">{item.icon}</div>

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
