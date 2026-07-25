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
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center transition-all duration-300 hover:border-[var(--primary-border)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--primary-border)] bg-[var(--primary-soft)]">
            <FileText className="h-7 w-7 text-[var(--primary)]" />
          </div>

          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            No publications added yet
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--text-muted)]">
            Add your research papers, blogs, articles, case studies, or project publications here.
          </p>

          <button
            type="button"
            onClick={handleAdd}
            className="btn-primary mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
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
          className="surface-card group rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all duration-300 hover:border-[var(--primary-border)] hover:shadow-md"
        >
          {/* Card Header */}
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--primary-border)] bg-[var(--primary-soft)]">
                <FileText className="h-5 w-5 text-[var(--primary)]" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  Publication {idx + 1}
                </h4>
                {!item.title && !item.url && (
                  <span className="badge rounded-full bg-[var(--background-soft)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
                    Optional
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="btn-danger flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>

          {/* Publication Content */}
          <div className="grid gap-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <FileText className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                Title
              </label>
              <input
                type="text"
                value={item.title ?? ""}
                placeholder="Example: Research Paper on AI Resume Screening"
                onChange={(e) => handleUpdate(idx, "title", e.target.value)}
                className="input-field"
              />
            </div>

            {/* Publication URL */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <Link2 className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                Publication URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={item.url ?? ""}
                  placeholder="https://example.com/publication"
                  onChange={(e) => handleUpdate(idx, "url", e.target.value)}
                  className="input-field pr-10"
                />
                <ExternalLink className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] py-4 text-sm font-medium text-[var(--text-muted)] transition hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
      >
        <Plus className="h-4 w-4" />
        Add Publication
      </button>
    </div>
  );
}