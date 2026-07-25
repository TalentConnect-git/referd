import { Loader2, Save, X } from "lucide-react";

type SectionActionsProps = {
  loading: boolean;
  onCancel: () => void;
  onSave: () => void;
  disabled?: boolean; // Optional disabled prop
};

export function SectionActions({ 
  loading, 
  onCancel, 
  onSave, 
  disabled = false // Default to false
}: SectionActionsProps) {
  return (
    <div className="mt-7 flex flex-col-reverse gap-3 border-t border-theme pt-5 sm:flex-row sm:justify-end">
      <button 
        onClick={onCancel} 
        disabled={loading || disabled} // Disable when loading or disabled
        className="btn-secondary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[13px] font-bold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <X className="h-4 w-4" /> Cancel
      </button>
      <button 
        onClick={onSave} 
        disabled={loading || disabled} // Disable when loading or disabled
        className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[13px] font-bold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
      </button>
    </div>
  );
}