import Link from "next/link";

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
    <footer className="border-t border-[var(--border)] bg-[var(--background)] px-6 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-b-lg rounded-t-lg border border-[rgba(49,170,64,0.35)] bg-[var(--primary-soft)]">
              <span className="h-3 w-3 rounded-full bg-[var(--primary)]" />
            </div>

            <span className="text-[15px] font-bold tracking-tight text-white">
              Referd
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