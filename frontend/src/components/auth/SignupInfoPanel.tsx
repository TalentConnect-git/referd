import { BadgeCheck, LayoutDashboard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import logo from "@/assets/icon.png"
import Image from "next/image";

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
    <div className="hidden w-[40%] rounded-l-3xl bg-card px-9 py-8 lg:block">
      <Link href="/" className="flex items-center gap-1.5 group">
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
        <span className="text-lg font-medium tracking-tight text-primary transition-colors duration-200 group-hover:text-primary">
          referd
          <span className="text-primary">.</span>
        </span>
      </Link>

      <p className="mt-9 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
        Create Account
      </p>

      <h1 className="mt-4 max-w-[280px] text-[24px] font-bold leading-tight tracking-[-0.04em] text-primary">
        Start your referral journey today
      </h1>

      <div className="mt-10 space-y-7">
        {items.map((item) => (
          <div key={item.title} className="flex gap-3">
            <div className="mt-[2px] text-primary">{item.icon}</div>

            <div>
              <h3 className="text-[13px] font-semibold text-primary">
                {item.title}
              </h3>
              <p className="mt-1 max-w-[240px] text-[11px] leading-5 text-primary">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 h-px w-full bg-divider" />

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
        Alumni Referral Network
      </p>
    </div>
  );
}