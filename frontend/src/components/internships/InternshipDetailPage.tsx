"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { applyJob, saveJob } from "@/services/job.service";
import { toast } from "react-hot-toast";

interface InternshipDetailPageProps {
  internship: any;
}

export default function InternshipDetailPage({
  internship,
}: InternshipDetailPageProps) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    try {
      setApplying(true);

      await applyJob(
        internship._id,
        internship.jobType,
        internship.matchScore || 0
      );

      toast.success("Application submitted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await saveJob(
        internship._id,
        internship.jobType,
        internship.matchScore || 0
      );

      toast.success("Internship saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save internship");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="
          mb-6
          flex
          items-center
          gap-2
          text-zinc-400
          transition-colors
        "
      >
        <ArrowLeft size={18} />
        Back to Internships
      </button>

      {/* Main Card */}
      <div
        className="
          rounded-3xl
          border
          border-[var(--border)]
          bg-[var(--card)]
          p-8
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-5 text-2xl font-bold text-slate-400">
              {internship.jobTitle?.[0] ||
                "Untitled Internship"}
            </h1>

            <p className="mt-2 text-zinc-400">
              {internship.companyPosted.companyDetails.companyName ||
                // ?.currentCompany_display ||
                // internship.companyName ||
                "Unknown Company"}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              📍
              {internship.location?.[0] ||
                internship.workLocation?.[0] ||
                "Remote"}
            </p>
          </div>

          {internship.matchScore && (
            <div
              className="
                rounded-full
                border
                border-green-500/30
                bg-green-500/10
                px-3
                py-1
                text-sm
                font-medium
                text-green-400
              "
            >
              {internship.matchScore}% Match
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="my-8 mt-5 border-t border-[var(--border)]" />

        {/* Description */}
        <section>
          <h2 className="mb-3 mt-5 text-xl font-semibold text-slate-400">
            Description
          </h2>

          <p className="mb-5 whitespace-pre-wrap text-zinc-400">
            {internship.description ||
              "No description available"}
          </p>
        </section>

        {/* Divider */}
        <div className="my-8 border-t border-[var(--border)]" />

        {/* Internship Details */}
        <section>
          <h2 className="mb-4 mt-5 text-xl font-semibold text-slate-400">
            Internship Details
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm text-blue-400">
                Employment Type
              </p>
              <p>
                {internship.employmentType?.join(", ") ||
                  "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-blue-400">
                Work Mode
              </p>
              <p>
                {internship.workMode?.join(", ") ||
                  "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-blue-400">
                Location
              </p>
              <p>
                📍
                {internship.location?.join(", ") ||
                  internship.workLocation?.join(", ") ||
                  "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-blue-400">
                Posted By
              </p>
              <p>
                {internship.companyPosted.employerDetails.name||
                  "Anonymous"}
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="my-8 mt-5 border-t border-[var(--border)]" />

        {/* Actions */}
        <div className="mt-8 flex gap-10">
          <span
            onClick={handleApply}
            style={{
              color: "#9ca3af",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "600",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#22c55e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#9ca3af";
            }}
          >
            {applying ? "Applying..." : "Apply Now"}
          </span>

          <span
            onClick={handleSave}
            style={{
              color: "#9ca3af",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "600",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#22c55e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#9ca3af";
            }}
          >
            {saving
              ? "Saving..."
              : "Save Internship"}
          </span>
        </div>
      </div>
    </div>
  );
}










