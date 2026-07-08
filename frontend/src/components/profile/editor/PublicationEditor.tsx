// components/profile/editor/PublicationEditor.tsx
"use client";

import { useEffect, useState } from "react";
import { ExternalLink, FileText, Plus, Trash2 } from "lucide-react";

import { TextInput } from "../shared/TextInput";
import type { Publication } from "@/types/profile";

type PublicationEditorProps = {
  publications: Publication[];
  onUpdate: (index: number, key: keyof Publication, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

const emptyPublication: Publication = {
  title: "",
  url: "",
};

export function PublicationEditor({
  publications,
  onUpdate,
  onAdd,
  onRemove,
}: PublicationEditorProps) {
  const [localPublications, setLocalPublications] = useState<Publication[]>(
    publications || [],
  );

  useEffect(() => {
    setLocalPublications(publications || []);
  }, [publications]);

  const handleUpdate = (
    index: number,
    key: keyof Publication,
    value: string,
  ) => {
    setLocalPublications((prev) =>
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
    setLocalPublications((prev) => [...prev, { ...emptyPublication }]);
    onAdd();
  };

  const handleRemove = (index: number) => {
    setLocalPublications((prev) => prev.filter((_, idx) => idx !== index));
    onRemove(index);
  };

  return (
    <div className="space-y-5">
      {localPublications.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#12381f] bg-[#071018] p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#12381f]">
            <FileText className="h-6 w-6 text-[#38e878]" />
          </div>

          <h3 className="text-base font-bold text-white">
            No publications added yet
          </h3>

          <p className="mt-1 text-sm text-[#94a3b8]">
            Add your research papers, blogs, articles, case studies, or project
            publications here.
          </p>
        </div>
      )}

      {localPublications.map((item, idx) => (
        <div
          key={item._id || `publication-${idx}`}
          className="rounded-2xl border border-[#12381f]/70 bg-[#071018] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#12381f]">
                <FileText className="h-5 w-5 text-[#38e878]" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  Publication {idx + 1}
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Add title and publication link
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
            <div className="grid gap-4">
              <TextInput
                label="Title"
                value={item.title ?? ""}
                placeholder="Example: Research Paper on AI Resume Screening"
                onChange={(value: string) =>
                  handleUpdate(idx, "title", value)
                }
              />

              <div className="relative">
                <TextInput
                  label="Publication URL"
                  type="url"
                  value={item.url ?? ""}
                  placeholder="https://example.com/publication"
                  onChange={(value: string) =>
                    handleUpdate(idx, "url", value)
                  }
                />

                <ExternalLink className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-[#94a3b8]" />
              </div>
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
        Add Publication
      </button>
    </div>
  );
}