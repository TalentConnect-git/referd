import { Loader2, Save, X } from "lucide-react";

type SectionActionsProps = {
  loading: boolean;
  onCancel: () => void;
  onSave: () => void;
};

export function SectionActions({ loading, onCancel, onSave }: SectionActionsProps) {
  return (
    <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end">
      <button onClick={onCancel} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-3 text-[13px] font-bold text-white hover:bg-[var(--card-hover)] disabled:opacity-60">
        <X className="h-4 w-4" /> Cancel
      </button>
      <button onClick={onSave} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
      </button>
    </div>
  );
}