// components/profile/editors/AwardEditor.tsx
"use client";

import { useEffect, useState } from "react";
import { Award as AwardIcon, Calendar, Plus, Trash2 } from "lucide-react";

import { TextInput } from "../shared/TextInput";
import { TextArea } from "../shared/TextArea";
import type { Award } from "@/types/profile";

type AwardEditorProps = {
  awards: Award[];
  onUpdate: (index: number, key: keyof Award, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

const emptyAward: Award = {
  title: "",
  organization: "",
  startDate: "",
  endDate: "",
  description: "",
};

function normalizeMonthValue(value?: string | null) {
  if (!value) return "";

  if (/^\d{4}-\d{2}$/.test(value)) return value;

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 7);
  }

  return "";
}

export function AwardEditor({
  awards,
  onUpdate,
  onAdd,
  onRemove,
}: AwardEditorProps) {
  const [localAwards, setLocalAwards] = useState<Award[]>(awards || []);

  useEffect(() => {
    setLocalAwards(awards || []);
  }, [awards]);

  const handleUpdate = (index: number, key: keyof Award, value: string) => {
    setLocalAwards((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );

    onUpdate(index, key, value);
  };

  const handleAdd = () => {
    setLocalAwards((prev) => [...prev, { ...emptyAward }]);
    onAdd();
  };

  const handleRemove = (index: number) => {
    setLocalAwards((prev) => prev.filter((_, idx) => idx !== index));
    onRemove(index);
  };

  return (
    <div className="space-y-5">
      {localAwards.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#12381f] bg-[#071018] p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#12381f]">
            <AwardIcon className="h-6 w-6 text-[#38e878]" />
          </div>

          <h3 className="text-base font-bold text-white">
            No awards added yet
          </h3>

          <p className="mt-1 text-sm text-[#94a3b8]">
            Add your achievements, recognitions, certificates, or competition
            awards here.
          </p>
        </div>
      )}

      {localAwards.map((item, idx) => (
        <div
          key={item._id || `award-${idx}`}
          className="rounded-2xl border border-[#12381f]/70 bg-[#071018] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#12381f]">
                <AwardIcon className="h-5 w-5 text-[#38e878]" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  Award {idx + 1}
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Title, organization, duration and description
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:border-red-400/60 hover:bg-red-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>

          <div className="rounded-2xl border border-[#12381f]/50 bg-[#0b1621] p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput
                label="Title"
                value={item.title ?? ""}
                onChange={(value: string) => handleUpdate(idx, "title", value)}
              />

              <TextInput
                label="Organization"
                value={item.organization ?? ""}
                onChange={(value: string) =>
                  handleUpdate(idx, "organization", value)
                }
              />

              <div className="relative">
                <TextInput
                  label="Start Date"
                  type="month"
                  value={normalizeMonthValue(item.startDate)}
                  onChange={(value: string) =>
                    handleUpdate(idx, "startDate", value)
                  }
                />

                <Calendar className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-[#94a3b8]" />
              </div>

              <div className="relative">
                <TextInput
                  label="End Date"
                  type="month"
                  value={normalizeMonthValue(item.endDate)}
                  onChange={(value: string) =>
                    handleUpdate(idx, "endDate", value)
                  }
                />

                <Calendar className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-[#94a3b8]" />
              </div>

              <TextArea
                label="Description"
                value={item.description ?? ""}
                className="md:col-span-2"
                onChange={(value: string) =>
                  handleUpdate(idx, "description", value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#38e878]/40 bg-[#071018] py-4 text-sm font-bold text-[#38e878] transition hover:border-[#38e878] hover:bg-[#12381f]/40"
      >
        <Plus className="h-4 w-4" />
        Add Award
      </button>
    </div>
  );
}