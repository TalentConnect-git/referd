import { ChevronDown } from "lucide-react";

type EditAccordionProps = {
  id: string;
  openSection: string;
  setOpenSection: (id: string) => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function EditAccordion({ id, openSection, setOpenSection, icon, title, subtitle, children }: EditAccordionProps) {
  const isOpen = openSection === id;
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <button
        type="button"
        onClick={() => setOpenSection(isOpen ? "" : id)}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
      >
        <span className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
          <span>
            <h2 className="text-[16px] font-bold text-white">{title}</h2>
            <p className="mt-1 text-[12px] text-[var(--text-muted)]">{subtitle}</p>
          </span>
        </span>
        <ChevronDown className={`h-5 w-5 text-[var(--text-primary)] transition ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="border-t border-[var(--border)] px-5 py-6 sm:px-7">{children}</div>}
    </section>
  );
}