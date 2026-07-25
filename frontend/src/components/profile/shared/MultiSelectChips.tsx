import { useState } from "react";
import { X } from "lucide-react";
import type { Option } from "./SelectInput"; // reuse Option type

type MultiSelectChipsProps = {
  label: string;
  value: string[];
  options: Option[];
  onChange: (items: string[]) => void;
  placeholder?: string;
};

export function MultiSelectChips({ label, value, options, onChange, placeholder = "Add" }: MultiSelectChipsProps) {
  const [custom, setCustom] = useState("");

  const addItem = (item: string) => {
    const clean = item.trim();
    if (!clean) return;
    if (!value.some((v) => v.toLowerCase() === clean.toLowerCase())) {
      onChange([...value, clean]);
    }
    setCustom("");
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
        <select
          value=""
          onChange={(e) => addItem(e.target.value)}
          className="select-field mb-3 h-11 w-full text-[13px]"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={`${opt.value}-${opt.label}`} value={opt.label}>{opt.label}</option>
          ))}
        </select>
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addItem(custom);
            }
          }}
          placeholder={placeholder}
          className="w-full bg-transparent px-1 text-[14px] text-primary outline-none placeholder:text-muted"
        />
      </div>
    </div>
  );
}