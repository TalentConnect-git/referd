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
    <div className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-overlay px-5 backdrop-blur-sm">
      <div className="modal-content w-full max-w-md rounded-3xl border border-theme bg-background p-6 text-primary shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft">
              <FileText className="h-7 w-7 text-primary" />
            </div>

            <h2 className="text-[24px] font-bold tracking-[-0.04em] text-primary">
              Upload Your Resume
            </h2>

            <p className="mt-1 text-[13px] text-primary">
              Upload a PDF to pre-fill your profile, or skip for now.
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-ghost rounded-full p-2 text-primary transition hover:bg-card-hover hover:text-secondary disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <label
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition ${
            isLoading
              ? "cursor-wait border-warning/40 bg-warning-soft"
              : isSuccess
              ? "border-success/50 bg-success-soft"
              : "border-theme/10 bg-background-soft/30 hover:border-primary hover:bg-primary-soft"
          }`}
        >
          {isSuccess ? (
            <CheckCircle className="mb-3 h-12 w-12 text-success" />
          ) : (
            <UploadIcon
              className={`mb-3 h-12 w-12 ${
                isLoading
                  ? "animate-pulse text-warning"
                  : "text-primary"
              }`}
            />
          )}

          <p className="text-center text-[13px] font-medium text-primary">
            {isLoading
              ? "Processing your resume..."
              : isSuccess
              ? "Successfully parsed!"
              : "Click to upload or drag and drop"}
          </p>

          <p className="mt-1 text-center text-[11px] text-primary">
            PDF only, max 5MB
          </p>

          {selectedFile && !isLoading && (
            <p className="mt-4 max-w-xs truncate text-[12px] font-medium text-primary">
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
                ? "border-success/30 bg-success-soft text-success"
                : isLoading
                ? "border-warning/30 bg-warning-soft text-warning"
                : "border-danger/30 bg-danger-soft text-danger"
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
            className="btn-secondary h-10 flex-1 rounded-lg border border-theme text-[13px] font-semibold text-primary transition hover:bg-card-hover disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleMainButtonClick}
            disabled={isLoading}
            className="btn-primary flex h-10 flex-1 items-center justify-center rounded-lg text-[13px] font-semibold text-inverse transition-all duration-300 hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
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