"use client";

import { useEffect, useState } from "react";
import { ExternalLink, FileText, Plus, Trash2, Link2 } from "lucide-react";

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
    <div className="space-y-6">
      
      

      {/* Empty State */}
      {localPublications.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#2a3a52] bg-[#111827] p-8 text-center hover:border-green-500/30 transition-all duration-300">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
            <FileText className="h-7 w-7 text-green-400" />
          </div>

          <h3 className="text-base font-semibold text-white">
            No publications added yet
          </h3>

          <p className="mt-1 text-sm text-gray-400 max-w-sm mx-auto">
            Add your research papers, blogs, articles, case studies, or project publications here.
          </p>

          <button
            type="button"
            onClick={handleAdd}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/20 hover:border-green-500/50 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Publication
          </button>
        </div>
      )}

      {/* Publication Cards */}
      {localPublications.map((item, idx) => (
        <div
          key={item._id || `publication-${idx}`}
          className="group rounded-xl border border-[#2a3a52] bg-[#111827] p-5 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5"
        >
          {/* Card Header */}
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20">
                <FileText className="h-5 w-5 text-green-400" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">
                  Publication {idx + 1}
                </h4>
                {!item.title && !item.url && (
                  <span className="text-[10px] text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full">Optional</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:border-red-500/50 hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>

          {/* Publication Content */}
          <div className="grid gap-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-gray-500" />
                Title
              </label>
              <input
                type="text"
                value={item.title ?? ""}
                placeholder="Example: Research Paper on AI Resume Screening"
                onChange={(e) => handleUpdate(idx, "title", e.target.value)}
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Publication URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-gray-500" />
                Publication URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={item.url ?? ""}
                  placeholder="https://example.com/publication"
                  onChange={(e) => handleUpdate(idx, "url", e.target.value)}
                  className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 pr-10 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                />
                <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#2a3a52] bg-[#111827] py-4 text-sm font-medium text-gray-400 transition hover:border-green-500/50 hover:text-green-400 hover:bg-green-500/5"
      >
        <Plus className="h-4 w-4" />
        Add Publication
      </button>
    </div>
  );
}