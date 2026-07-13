import Link from "next/link";
import logo from "@/assets/icon.png";
import Image from "next/image";

const footerLinks = [
  {
    label: "About Us",
    href: "/aboutus",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms of Service",
    href: "/terms-of-service",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "Contact",
    href: "mailto:support@referd.in",
    isExternal: true,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#2a3a52] bg-[#0f172a] px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <div className="relative h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
            <Image
              src={logo}
              alt="Referd Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-sm font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-green-500">
            referd<span className="text-green-500">.</span>
          </span>
        </Link>

        {/* Tagline */}
        <p className="text-[11px] text-slate-400 text-center sm:text-left">
          India's first alumni-vouched referral network.
        </p>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {footerLinks.map((link) => {
            if (link.isExternal) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[11px] text-slate-400 transition-colors hover:text-green-500 whitespace-nowrap"
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] text-slate-400 transition-colors hover:text-green-500 whitespace-nowrap"
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Copyright */}
        <p className="text-[10px] text-slate-500">
          © 2026 Referd Technologies, Inc.
        </p>
      </div>
    </footer>
  );
}