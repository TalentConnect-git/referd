"use client";

import { ArrowLeft, Briefcase, MapPin, Building2, Calendar, Clock, Users, Bookmark, Send, CheckCircle } from "lucide-react";
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

  // Get job role (priority: jobRoles > jobTitle)
  const jobRole = internship.jobRoles?.[0] || internship.jobTitle?.[0] || "Untitled Internship";
  
  // Get company name
  const companyName = internship.companyPosted?.companyDetails?.companyName || 
                      internship.companyName || 
                      "Unknown Company";
  
  // Get location
  const location = internship.location?.[0] || internship.workLocation?.[0] || "Remote";
  
  // Get match score
  const matchScore = internship.matchScore || 0;

  return (
    <div className="min-h-screen  p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="
            mb-4
            inline-flex
            items-center
            gap-1.5
            text-xs
            text-slate-400
            hover:text-white
            transition-colors
            group
          "
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Main Card */}
        <div
          className="
            rounded-2xl
            border
            border-[#2a3a52]
            bg-gradient-to-r
            from-[#111827]
            to-[#1a2332]
            p-5
            shadow-xl
            shadow-black/20
          "
        >
          {/* Header with Action Buttons */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white tracking-tight">
                {jobRole}
              </h1>

              <div className="mt-1.5 flex items-center gap-2">
                <Building2 size={14} className="text-slate-500 flex-shrink-0" />
                <p className="text-sm text-slate-400">
                  {companyName}
                </p>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <MapPin size={14} className="text-slate-500 flex-shrink-0" />
                <p className="text-xs text-slate-500">
                  {location}
                </p>
              </div>
            </div>

            {/* Action Buttons - Top Right */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              {matchScore > 0 && (
                <div
                  className={`
                    text-center
                    rounded-full
                    border
                    px-3
                    py-0.5
                    text-[10px]
                    font-semibold
                    ${matchScore >= 75 ? 'border-green-500/30 bg-green-500/10 text-green-400' :
                      matchScore >= 40 ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' :
                      'border-red-500/30 bg-red-500/10 text-red-400'}
                  `}
                >
                  {matchScore}% Match
                </div>
              )}

              <button
                onClick={handleApply}
                disabled={applying}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-1.5
                  rounded-lg
                  bg-gradient-to-r
                  from-green-500
                  to-emerald-600
                  px-4
                  py-1.5
                  text-xs
                  font-semibold
                  text-black
                  transition-all
                  hover:scale-105
                  hover:shadow-lg
                  hover:shadow-green-500/30
                  active:scale-95
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  disabled:hover:scale-100
                  whitespace-nowrap
                "
              >
                {applying ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Applying...
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    Apply
                  </>
                )}
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-1.5
                  rounded-lg
                  border
                  border-[#2a3a52]
                  bg-[#0f172a]
                  px-4
                  py-1.5
                  text-xs
                  font-semibold
                  text-slate-400
                  transition-all
                  hover:border-green-500/30
                  hover:bg-green-500/10
                  hover:text-green-400
                  hover:scale-105
                  active:scale-95
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  disabled:hover:scale-100
                  whitespace-nowrap
                "
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Bookmark size={12} />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-[#2a3a52]" />

          {/* Description */}
          <section>
            <h2 className="mb-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Description
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {internship.description || "No description available"}
            </p>
          </section>

          {/* Divider */}
          <div className="my-4 border-t border-[#2a3a52]" />

          {/* Internship Details */}
          <section>
            <h2 className="mb-3 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Internship Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Employment Type */}
              <div className="rounded-lg bg-[#0f172a] border border-[#2a3a52] p-3">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  Employment Type
                </p>
                <p className="mt-0.5 text-sm text-slate-300">
                  {internship.employmentType?.join(", ") || "Not specified"}
                </p>
              </div>

              {/* Work Mode */}
              <div className="rounded-lg bg-[#0f172a] border border-[#2a3a52] p-3">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  Work Mode
                </p>
                <p className="mt-0.5 text-sm text-slate-300">
                  {internship.workMode?.join(", ") || "Not specified"}
                </p>
              </div>

              {/* Location */}
              <div className="rounded-lg bg-[#0f172a] border border-[#2a3a52] p-3">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  Location
                </p>
                <p className="mt-0.5 text-sm text-slate-300 flex items-center gap-1">
                  <MapPin size={12} className="text-slate-500" />
                  {internship.location?.join(", ") || 
                   internship.workLocation?.join(", ") || 
                   "Not specified"}
                </p>
              </div>

              {/* Posted By */}
              <div className="rounded-lg bg-[#0f172a] border border-[#2a3a52] p-3">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  Posted By
                </p>
                <p className="mt-0.5 text-sm text-slate-300">
                  {internship.companyPosted?.employerDetails?.name ||
                   internship.companyPosted?.name ||
                   "Anonymous"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}