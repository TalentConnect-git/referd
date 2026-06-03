import Link from "next/link";

const navLinks = [
  {
    label: "Product",
    href: "#product",
  },
  {
    label: "Referrals",
    href: "#referrals",
  },
  {
    label: "Network",
    href: "#network",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
  
];

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-13 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center  justify-center rounded-b-lg rounded-t-lg border border-[rgba(49,170,64,0.35)] bg-[var(--primary-soft)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
            </div>

            <span className="text-[13px] font-bold tracking-tight text-white">
              Referd
              <span className="text-[var(--primary)]">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-[var(--text-primary)] transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="hidden text-[13px] font-medium text-[var(--text-primary)] transition hover:text-white sm:inline-flex"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="button-color rounded-lg  px-4 py-2 text-[13px] font-mono transition hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}