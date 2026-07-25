import { ChevronDown } from "lucide-react";

type NavOptionProps = {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
};

export function NavOption({ active, icon, title, onClick }: NavOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
        active
          ? "border-primary bg-primary-soft text-primary"
          : "border-transparent bg-transparent text-primary hover:bg-background-soft hover:text-primary"
      }`}
    >
      <span className="flex items-center gap-3 text-[13px] font-bold">
        <span className="[&_svg]:h-4 [&_svg]:w-4">{icon}</span>
        {title}
      </span>
      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${active ? "rotate-180" : ""}`} />
    </button>
  );
}