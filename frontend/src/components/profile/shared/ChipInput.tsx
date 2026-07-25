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
      <span className="form-label mb-2 block text-[12px]">{label}</span>
      <div className="surface-card p-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((item, idx) => (
            <span
              key={`${item}-${idx}`}
              className="badge"
            >
              {item}
              <button
                onClick={() => onChange(value.filter((_, i) => i !== idx))}
                className="text-muted hover:text-danger transition-colors"
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
          className="w-full bg-transparent px-1 text-[14px] text-primary outline-none placeholder:text-muted"
        />
      </div>
    </div>
  );
}