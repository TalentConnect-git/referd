import { useState } from "react";
import { X } from "lucide-react";

type ChipInputProps = {
  label: string;
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
};

export function ChipInput({ label, value, onChange, placeholder = "Type and press Enter" }: ChipInputProps) {
  const [input, setInput] = useState("");

  const addItem = (item: string) => {
    const clean = item.trim();
    if (!clean) return;
    if (!value.some((v) => v.toLowerCase() === clean.toLowerCase())) {
      onChange([...value, clean]);
    }
    setInput("");
  };

  return (
    <div>
      <span className="mb-2 block text-[12px] font-semibold text-[var(--text-primary)]">{label}</span>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((item, idx) => (
            <span
              key={`${item}-${idx}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-[12px] font-semibold text-white"
            >
              {item}
              <button
                onClick={() => onChange(value.filter((_, i) => i !== idx))}
                className="text-[var(--text-muted)] hover:text-red-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addItem(input);
            }
          }}
          placeholder={placeholder}
          className="h-10 w-full bg-transparent px-1 text-[14px] text-white outline-none placeholder:text-[var(--text-muted)]"
        />
      </div>
    </div>
  );
}