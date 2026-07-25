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
    <footer className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-between">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-1.5 group flex-shrink-0">
          <div className="relative h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
            <Image
              src={logo}
              alt="Referd Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-sm font-bold tracking-tight text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary)]">
            referd<span className="text-[var(--primary)]">.</span>
          </span>
        </Link>

        {/* Tagline - Hidden on smallest screens */}
        <p className="hidden text-xs text-[var(--text-muted)] text-center sm:block sm:text-left">
          India's first alumni-vouched referral network.
        </p>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {footerLinks.map((link) => {
            const linkClassName =
              "text-xs text-[var(--text-muted)] transition-all duration-200 hover:text-[var(--primary)] hover:scale-105 whitespace-nowrap";
            
            if (link.isExternal) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={linkClassName}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.label}
                href={link.href}
                className={linkClassName}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Copyright */}
        <p className="text-[10px] text-[var(--text-subtle)] flex-shrink-0">
          © 2026 Referd Technologies, Inc.
        </p>
      </div>

      {/* Mobile Tagline - Only visible on small screens */}
      <p className="mt-3 text-center text-xs text-[var(--text-muted)] sm:hidden">
        India's first alumni-vouched referral network.
      </p>
    </footer>
  );
}