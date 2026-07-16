"use client";

import { ChangeEvent, useState } from "react";
import { Upload, X, User, Mail, Phone, Calendar, Link, Globe, FileText, Image, Info, Briefcase, Shield,Loader2 } from "lucide-react";

import { TextArea } from "../shared/TextArea";
import { TextInput } from "../shared/TextInput";
import { SelectInput } from "../shared/SelectInput";

import type { EditForm, Option } from "@/types/profile";
import { updateOnboardingFilesApi } from "@/services/auth.service";

// Custom SVG Icons
const LinkedInIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

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

const visaStatusOptions: Option[] = [
  { value: "citizen", label: "Citizen" },
  { value: "permanent_resident", label: "Permanent Resident" },
  { value: "h1b", label: "Work Visa (e.g., H1-B)" },
  { value: "f1", label: "Student Visa (e.g., F1)" },
  { value: "not_authorized", label: "Not Authorized to Work" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

type UploadMessage = {
  type: "success" | "error";
  text: string;
};

function extractUploadedFileUrl(response: any, fieldName: "resume" | "profileImage") {
  return (
    response?.data?.[fieldName] ||
    response?.data?.onboarding?.[fieldName] ||
    response?.data?.user?.[fieldName] ||
    response?.onboarding?.[fieldName] ||
    response?.user?.[fieldName] ||
    response?.[fieldName] ||
    response?.url ||
    response?.fileUrl ||
    ""
  );
}

export function BasicInfoEditor({ form, updateField }: BasicInfoEditorProps) {
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);

  const [resumeMessage, setResumeMessage] = useState<UploadMessage | null>(null);
  const [profileImageMessage, setProfileImageMessage] =
    useState<UploadMessage | null>(null);

  async function uploadSingleFile(
    fieldName: "resume" | "profileImage",
    file: File
  ) {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await updateOnboardingFilesApi(formData);
    return extractUploadedFileUrl(response, fieldName);
  }

  async function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    try {
      setIsUploadingProfileImage(true);
      setProfileImageMessage(null);

      if (!file.type.startsWith("image/")) {
        setProfileImageMessage({
          type: "error",
          text: "Only image files are allowed.",
        });
        URL.revokeObjectURL(previewUrl);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setProfileImageMessage({
          type: "error",
          text: "Image size must be less than 5MB.",
        });
        URL.revokeObjectURL(previewUrl);
        return;
      }

      updateField("profileImage", previewUrl as EditForm["profileImage"]);

      const uploadedUrl = await uploadSingleFile("profileImage", file);

      if (uploadedUrl) {
        updateField("profileImage", uploadedUrl as EditForm["profileImage"]);
        URL.revokeObjectURL(previewUrl);
      }

      setProfileImageMessage({
        type: "success",
        text: "Profile image uploaded successfully.",
      });
    } catch (error) {
      console.error("Profile image upload failed:", error);

      setProfileImageMessage({
        type: "error",
        text: "Profile image upload failed. Please try again later.",
      });
    } finally {
      setIsUploadingProfileImage(false);
      event.target.value = "";
    }
  }

  async function handleResumeChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingResume(true);
      setResumeMessage(null);

      if (file.type !== "application/pdf") {
        setResumeMessage({
          type: "error",
          text: "Only PDF files are allowed.",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setResumeMessage({
          type: "error",
          text: "File size must be less than 5MB.",
        });
        return;
      }

      const uploadedUrl = await uploadSingleFile("resume", file);

      updateField(
        "resume",
        (uploadedUrl || file.name) as EditForm["resume"]
      );

      setResumeMessage({
        type: "success",
        text: "Resume uploaded successfully.",
      });
    } catch (error) {
      console.error("Resume upload failed:", error);

      setResumeMessage({
        type: "error",
        text: "Resume upload failed. Please try again later.",
      });
    } finally {
      setIsUploadingResume(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Full Name"
            value={form.fullName}
            onChange={(value: string) => {
              updateField("fullName", value as EditForm["fullName"]);
              updateField("name", value as EditForm["name"]);
            }}
            placeholder="Enter your full name"
          />

          <TextInput
            label="Email"
            value={form.email}
            onChange={(value: string) =>
              updateField("email", value as EditForm["email"])
            }
            placeholder="Enter your email"
            type="email"
          />

          <TextInput
            label="Phone"
            value={form.phone}
            onChange={(value: string) =>
              updateField("phone", value as EditForm["phone"])
            }
            placeholder="Enter your phone number"
            type="tel"
          />

          <SelectInput
            label="Gender"
            value={form.gender}
            options={genderOptions}
            onChange={(value: string) =>
              updateField("gender", value as EditForm["gender"])
            }
            placeholder="Select gender"
          />

          <TextInput
            label="Date of Birth"
            type="date"
            value={form.dob}
            onChange={(value: string) =>
              updateField("dob", value as EditForm["dob"])
            }
            placeholder="Select date of birth"
          />

          <SelectInput
            label="Ethnicity"
            value={form.ethnicity}
            options={ethnicityOptions}
            onChange={(value: string) =>
              updateField("ethnicity", value as EditForm["ethnicity"])
            }
            placeholder="Select ethnicity"
          />

          <SelectInput
            label="Marital Status"
            value={form.maritalStatus}
            options={maritalStatusOptions}
            onChange={(value: string) =>
              updateField("maritalStatus", value as EditForm["maritalStatus"])
            }
            placeholder="Select marital status"
          />

          <SelectInput
            label="Visa Status"
            value={form.visaStatus}
            options={visaStatusOptions}
            onChange={(value: string) =>
              updateField("visaStatus", value as EditForm["visaStatus"])
            }
            placeholder="Select visa status"
          />
        </div>
      </div>

      {/* Social & Professional Links */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Link className="h-4 w-4 text-green-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Social & Professional Links
          </h4>
          <div className="flex-1 h-px bg-[#2a3a52]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <TextInput
              label="LinkedIn"
              value={form.linkedin}
              onChange={(value: string) =>
                updateField("linkedin", value as EditForm["linkedin"])
              }
              placeholder="https://linkedin.com/in/username"
            />
            <div className="absolute right-3 top-[38px] text-gray-500">
              <LinkedInIcon />
            </div>
          </div>

          <div className="relative">
            <TextInput
              label="GitHub"
              value={form.github}
              onChange={(value: string) =>
                updateField("github", value as EditForm["github"])
              }
              placeholder="https://github.com/username"
            />
            <div className="absolute right-3 top-[38px] text-gray-500">
              <GitHubIcon />
            </div>
          </div>

          <div className="relative">
            <TextInput
              label="Portfolio"
              value={form.portfolio}
              onChange={(value: string) =>
                updateField("portfolio", value as EditForm["portfolio"])
              }
              placeholder="https://yourportfolio.com"
            />
            <div className="absolute right-3 top-[38px] text-gray-500">
              <Globe className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-green-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            About
          </h4>
          <div className="flex-1 h-px bg-[#2a3a52]" />
        </div>
        <TextArea
          label="About"
          value={form.about}
          onChange={(value: string) =>
            updateField("about", value as EditForm["about"])
          }
          placeholder="Tell us about yourself, your experience, and what you're looking for..."
          rows={4}
        />
      </div>

      {/* Files & Media */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-green-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Files & Media
          </h4>
          <div className="flex-1 h-px bg-[#2a3a52]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Profile Image */}
          <div className="rounded-xl border border-[#2a3a52] bg-[#111827] p-4 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-green-400" />
                <span className="text-sm font-semibold text-white">Profile Image</span>
              </div>
              {form.profileImage && (
                <button
                  type="button"
                  onClick={() => {
                    updateField("profileImage", "" as EditForm["profileImage"]);
                    setProfileImageMessage(null);
                  }}
                  className="rounded-lg p-1 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {form.profileImage && (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={form.profileImage}
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-green-500/30 ring-offset-2 ring-offset-[#111827]"
                />
                <span className="text-xs text-gray-400 break-all flex-1">
                  {form.profileImage.length > 50 
                    ? form.profileImage.substring(0, 50) + "..." 
                    : form.profileImage}
                </span>
              </div>
            )}

            <div className="mt-3">
              <label className="relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#2a3a52] bg-[#0f172a] px-4 py-3 transition hover:border-green-500/50 hover:bg-green-500/5">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  disabled={isUploadingProfileImage}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-white">
                    {isUploadingProfileImage ? "Uploading..." : "Upload Image"}
                  </span>
                </div>
              </label>
            </div>

            {isUploadingProfileImage && (
              <p className="mt-2 flex items-center gap-2 text-xs text-green-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading profile image…
              </p>
            )}

            {profileImageMessage && !isUploadingProfileImage && (
              <p className={`mt-2 text-xs ${
                profileImageMessage.type === "success"
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}>
                {profileImageMessage.text}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-500">
              Accepted formats: JPG, PNG, GIF, SVG • Max size: 5MB
            </p>
          </div>

          {/* Resume */}
          <div className="rounded-xl border border-[#2a3a52] bg-[#111827] p-4 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-400" />
                <span className="text-sm font-semibold text-white">Resume</span>
              </div>
              {form.resume && (
                <button
                  type="button"
                  onClick={() => {
                    updateField("resume", "" as EditForm["resume"]);
                    setResumeMessage(null);
                  }}
                  className="rounded-lg p-1 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {form.resume && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#0f172a] px-3 py-2 border border-[#2a3a52]">
                <FileText className="h-4 w-4 text-green-400" />
                <span className="text-sm text-white truncate flex-1">
                  {form.resume.length > 50 ? form.resume.substring(0, 50) + "..." : form.resume}
                </span>
                <span className="text-xs text-gray-500">PDF</span>
              </div>
            )}

            <div className="mt-3">
              <label className="relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#2a3a52] bg-[#0f172a] px-4 py-3 transition hover:border-green-500/50 hover:bg-green-500/5">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleResumeChange}
                  disabled={isUploadingResume}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-white">
                    {isUploadingResume ? "Uploading..." : "Upload Resume"}
                  </span>
                </div>
              </label>
            </div>

            {isUploadingResume && (
              <p className="mt-2 flex items-center gap-2 text-xs text-green-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading resume…
              </p>
            )}

            {resumeMessage && !isUploadingResume && (
              <p className={`mt-2 text-xs ${
                resumeMessage.type === "success"
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}>
                {resumeMessage.text}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-500">
              Accepted format: PDF • Max size: 5MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}