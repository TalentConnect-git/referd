import Link from "next/link";
import logo from "@/assets/icon.png"
import Image from "next/image";

const footerLinks = [
  {
    label: "Privacy",
    href: "#privacy",
  },
  {
    label: "Terms",
    href: "#terms",
  },
  {
    label: "Security",
    href: "#security",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] px-6 py-16 sm:px-8 lg:px-10 mt-5">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
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
        <span className="text-sm font-medium tracking-tight text-white transition-colors duration-200 group-hover:text-[var(--primary)]">
          referd
          <span className="text-[var(--primary)]">.</span>
        </span>
      </Link>

          <p className="mt-5 text-[15px] text-[var(--text-primary)]">
            India's first alumni-vouched referral network.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-10">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] text-[var(--text-primary)] transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-[13px] text-[var(--text-primary)]">
          © 2026 Referd Technologies, Inc.
        </p>
      </div>
    </footer>
  );
}