"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadIcon,
  FileText,
  CheckCircle,
  ChevronRight,
  X,
} from "lucide-react";

import { uploadResumeApi } from "@/services/auth.service";

type ResumeUploadProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function ResumeUpload({
  isOpen = true,
  onClose,
}: ResumeUploadProps) {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasUploadFailed, setHasUploadFailed] = useState(false);

  if (!isOpen) return null;

  const getNextRoute = () => {
    return "/onboarding/stepTwo";
  };

  const moveToNextStep = () => {
    router.push(getNextRoute());
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMessage("");
    setIsSuccess(false);
    setHasUploadFailed(false);

    if (file.type !== "application/pdf") {
      setSelectedFile(null);
      setMessage("Only PDF file is allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedFile(null);
      setMessage("File size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      moveToNextStep();
      return;
    }

    try {
      setIsLoading(true);
      setIsSuccess(false);
      setHasUploadFailed(false);
      setMessage("Parsing your resume... Please wait.");

      const data = await uploadResumeApi(selectedFile);

      localStorage.setItem("parsedResume", JSON.stringify(data));

      setIsSuccess(true);
      setHasUploadFailed(false);
      setMessage("Success! Resume parsed successfully.");

      moveToNextStep();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";

      console.error("Resume upload error:", error);

      setMessage(errorMessage);
      setIsSuccess(false);
      setHasUploadFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMainButtonClick = () => {
    if (hasUploadFailed) {
      moveToNextStep();
      return;
    }

    handleUpload();
  };

  const getButtonText = () => {
    if (hasUploadFailed) return "Skip";
    if (selectedFile) return "Continue";
    return "Skip for now";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)]">
              <FileText className="h-7 w-7 text-[var(--primary)]" />
            </div>

            <h2 className="text-[24px] font-bold tracking-[-0.04em] text-white">
              Upload Your Resume
            </h2>

            <p className="mt-1 text-[13px] text-[var(--text-primary)]">
              Upload a PDF to pre-fill your profile, or skip for now.
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-full p-2 text-[var(--text-primary)] transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <label
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition ${
            isLoading
              ? "cursor-wait border-yellow-400/40 bg-yellow-400/10"
              : isSuccess
              ? "border-green-400/50 bg-green-400/10"
              : "border-white/10 bg-white/[0.03] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]"
          }`}
        >
          {isSuccess ? (
            <CheckCircle className="mb-3 h-12 w-12 text-green-400" />
          ) : (
            <UploadIcon
              className={`mb-3 h-12 w-12 ${
                isLoading
                  ? "animate-pulse text-yellow-400"
                  : "text-[var(--text-primary)]"
              }`}
            />
          )}

          <p className="text-center text-[13px] font-medium text-white">
            {isLoading
              ? "Processing your resume..."
              : isSuccess
              ? "Successfully parsed!"
              : "Click to upload or drag and drop"}
          </p>

          <p className="mt-1 text-center text-[11px] text-[var(--text-primary)]">
            PDF only, max 5MB
          </p>

          {selectedFile && !isLoading && (
            <p className="mt-4 max-w-xs truncate text-[12px] font-medium text-[var(--primary)]">
              Selected: {selectedFile.name}
            </p>
          )}

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
          />
        </label>

        {message && (
          <div
            className={`mt-4 rounded-xl border p-3 text-[12px] font-medium ${
              isSuccess
                ? "border-green-400/30 bg-green-400/10 text-green-300"
                : isLoading
                ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
                : "border-red-400/30 bg-red-400/10 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 flex-1 rounded-lg border border-white/10 text-[13px] font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleMainButtonClick}
            disabled={isLoading}
            className="button-color flex h-10 flex-1 items-center justify-center rounded-lg text-[13px] font-semibold text-black transition-all duration-300 hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
          >
            {isLoading ? (
              "Processing..."
            ) : (
              <>
                {getButtonText()}
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}