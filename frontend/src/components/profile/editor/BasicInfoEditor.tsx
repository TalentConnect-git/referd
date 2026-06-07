"use client";

import { ChangeEvent, useState } from "react";

import { TextArea } from "../shared/TextArea";
import { TextInput } from "../shared/TextInput";
import { SelectInput } from "../shared/SelectInput";

import type { EditForm, Option } from "@/types/profile";
import { uploadResumeApi } from "@/services/auth.service";

type BasicInfoEditorProps = {
  form: EditForm;
  updateField: <K extends keyof EditForm>(field: K, value: EditForm[K]) => void;
};

const genderOptions: Option[] = [
  "Male",
  "Female",
  "Non-binary",
  "Prefer not to say",
].map((value) => ({ value, label: value }));

const ethnicityOptions: Option[] = [
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Native American or Alaska Native",
  "White",
  "Two or more races",
  "Prefer not to say",
].map((value) => ({ value, label: value }));

const maritalStatusOptions: Option[] = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
  "Prefer not to say",
].map((value) => ({ value, label: value }));

export function BasicInfoEditor({ form, updateField }: BasicInfoEditorProps) {
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeMessage, setResumeMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    updateField("profileImage", previewUrl as EditForm["profileImage"]);
  }

  async function handleResumeChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingResume(true);
      setResumeMessage(null);

      if (file.type !== "application/pdf") {
        setResumeMessage({ type: "error", text: "Only PDF files are allowed." });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setResumeMessage({ type: "error", text: "File size must be less than 5MB." });
        return;
      }

      const data = await uploadResumeApi(file);

      const resumeUrl =
        (data as any)?.resume ||
        (data as any)?.resumeUrl ||
        (data as any)?.url ||
        (data as any)?.fileUrl ||
        file.name;

      updateField("resume", resumeUrl as EditForm["resume"]);
      setResumeMessage({ type: "success", text: "Resume uploaded successfully." });
    } catch (error) {
      console.error("Resume upload failed:", error);
      setResumeMessage({ type: "error", text: "Upload failed. Please try again later." });
    } finally {
      setIsUploadingResume(false);
      event.target.value = "";
    }
  }

  const fileInputClass =
    "text-sm text-white file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[var(--primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="Full Name"
          value={form.fullName}
          onChange={(value: string) => {
            updateField("fullName", value as EditForm["fullName"]);
            updateField("name", value as EditForm["name"]);
          }}
        />

        <TextInput
          label="Email"
          value={form.email}
          onChange={(value: string) =>
            updateField("email", value as EditForm["email"])
          }
        />

        <TextInput
          label="Phone"
          value={form.phone}
          onChange={(value: string) =>
            updateField("phone", value as EditForm["phone"])
          }
        />

        <SelectInput
          label="Gender"
          value={form.gender}
          options={genderOptions}
          onChange={(value: string) =>
            updateField("gender", value as EditForm["gender"])
          }
        />

        <TextInput
          label="Date of Birth"
          type="date"
          value={form.dob}
          onChange={(value: string) =>
            updateField("dob", value as EditForm["dob"])
          }
        />

        <SelectInput
          label="Ethnicity"
          value={form.ethnicity}
          options={ethnicityOptions}
          onChange={(value: string) =>
            updateField("ethnicity", value as EditForm["ethnicity"])
          }
        />

        <SelectInput
          label="Marital Status"
          value={form.maritalStatus}
          options={maritalStatusOptions}
          onChange={(value: string) =>
            updateField("maritalStatus", value as EditForm["maritalStatus"])
          }
        />

        <TextInput
          label="LinkedIn"
          value={form.linkedin}
          onChange={(value: string) =>
            updateField("linkedin", value as EditForm["linkedin"])
          }
        />

        <TextInput
          label="GitHub"
          value={form.github}
          onChange={(value: string) =>
            updateField("github", value as EditForm["github"])
          }
        />

        <TextInput
          label="Portfolio"
          value={form.portfolio}
          onChange={(value: string) =>
            updateField("portfolio", value as EditForm["portfolio"])
          }
        />
      </div>

      <div className="mt-4">
        <TextArea
          label="About"
          value={form.about}
          onChange={(value: string) =>
            updateField("about", value as EditForm["about"])
          }
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Profile Image */}
        <div>
          <span className="mb-2 block text-[12px] font-semibold text-[var(--text-primary)]">
            Profile Image
          </span>

          {form.profileImage && (
            <img
              src={form.profileImage}
              alt="Profile"
              className="mb-3 h-20 w-20 rounded-full object-cover ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--background)]"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className={fileInputClass}
          />
        </div>

        {/* Resume */}
        <div>
          <span className="mb-2 block text-[12px] font-semibold text-[var(--text-primary)]">
            Resume
          </span>

          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeChange}
            disabled={isUploadingResume}
            className={fileInputClass}
          />

          {isUploadingResume && (
            <p className="mt-2 flex items-center gap-2 text-xs text-[var(--primary)]">
              <svg
                className="h-3.5 w-3.5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Uploading resume…
            </p>
          )}

          {resumeMessage && !isUploadingResume && (
            <p
              className={`mt-2 text-xs ${
                resumeMessage.type === "success"
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {resumeMessage.text}
            </p>
          )}

          {form.resume && !isUploadingResume && !resumeMessage && (
            <p className="mt-2 break-all text-xs text-[var(--text-muted)]">
              Current: {form.resume}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}