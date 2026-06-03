import { ChangeEvent, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
type ResumeUploadProps = {
  onUpload?: (file: File) => void;
};

export default function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const router=useRouter();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
     
    onUpload?.(selectedFile);
    
    console.log("Uploaded file:", selectedFile);
  };

  return (
    <div className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--card)]/70 p-7 shadow-2xl backdrop-blur-xl">
      <div className="mb-7">
        <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          Resume Upload
        </p>

        <h1 className="text-[24px] font-bold tracking-[-0.04em] text-white">
          Upload your resume
        </h1>

        <p className="mt-2 text-[13px] leading-6 text-[var(--text-primary)]">
          Add your resume so we can complete your profile and match you with
          better referral opportunities.
        </p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[var(--background)] px-5 py-10 text-center transition hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <Upload size={22} />
        </div>

        <span className="mt-4 text-[14px] font-semibold text-white">
          Click to upload resume
        </span>

        <span className="mt-1 text-[12px] text-[var(--text-primary)]">
          PDF, DOC, or DOCX supported
        </span>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {selectedFile && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
            <FileText size={16} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">
              {selectedFile.name}
            </p>
            <p className="text-[11px] text-[var(--text-primary)]">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-primary)] transition hover:border-white/20 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <button
        type="button"
        disabled={!selectedFile}
        onClick={handleUpload}
        className="button-color hover:cursor-pointer mt-5 h-10 w-full rounded-lg text-[13px] font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}