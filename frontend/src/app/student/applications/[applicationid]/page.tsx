"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostedByReferrer from "@/components/dashboard/PostedByReferrer";
import { ArrowLeft, Building2, Calendar, User, Briefcase, Clock, MapPin, Mail, Phone, Award, Target } from "lucide-react";
import { getApplicationDetails } from "@/services/application.service";
import ApplicationTimeline from "@/components/applications/ApplicationTimeline";

export default function ApplicationDetailsPage() {
  const { applicationid } = useParams();
  console.log("Params ", useParams());
  const router = useRouter();

  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getApplicationDetails(applicationid as string);
        let data = res.data;
        setApplication(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDetails();
  }, [applicationid]);

  if (!application) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-8 text-center">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-500/30 border-t-blue-500"></div>
            <span className="ml-3 text-sm text-gray-400">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Get job details
  const jobDetails = application.job || application.jobDetails || {};
  const receiverProfile = jobDetails.receiverProfile || {};
  
  // Get status color
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      "Applied": "bg-blue-500/10 text-blue-400 border-blue-500/30",
      "Application Sent": "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      "Awaiting Recruiter Action": "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      "Shortlisted": "bg-purple-500/10 text-purple-400 border-purple-500/30",
      "Interview Scheduled": "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      "Offer Extended": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      "Accepted": "bg-green-500/10 text-green-400 border-green-500/30",
      "Rejected": "bg-red-500/10 text-red-400 border-red-500/30",
      "Referred To Company": "bg-orange-500/10 text-orange-400 border-orange-500/30",
      "Offer Accepted": "bg-green-600/10 text-green-500 border-green-600/30",
      "Offer Rejected": "bg-red-600/10 text-red-500 border-red-600/30",
      "Joined The Company": "bg-teal-500/10 text-teal-400 border-teal-500/30",
    };
    return statusColors[status] || "bg-gray-500/10 text-gray-400 border-gray-500/30";
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-1.5 text-gray-400 hover:text-white transition-all duration-200 mb-4"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-xs font-medium">Back</span>
      </button>

      {/* Main Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#0f172a] to-[#1a2332] p-5 sm:p-6 mb-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Job Title & Company */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
                {jobDetails?.jobTitle?.[0] || "Application"}
              </h1>
              {application.jobType && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border flex-shrink-0 ${
                  application.jobType === "Referral" 
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/30" 
                    : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                }`}>
                  {application.jobType}
                </span>
              )}
            </div>

            {/* Company & Location */}
            <div className="flex flex-wrap items-center gap-3 text-slate-400 text-sm">
              <div className="flex items-center gap-1.5">
                <Building2 size={14} className="text-slate-500" />
                <span>{jobDetails?.companyName || "Company"}</span>
              </div>
              {jobDetails?.location && jobDetails.location.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-500" />
                  <span className="text-xs">{jobDetails.location.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Job Details Grid - Compact */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar size={13} className="text-slate-500" />
                <span>Applied {new Date(application.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}</span>
              </div>

              {application.matchScore > 0 && (
                <div className="flex items-center gap-1.5">
                  <Target size={13} className="text-slate-500" />
                  <span className="text-slate-400">Match:</span>
                  <span className={`font-semibold text-xs ${
                    application.matchScore >= 75 ? "text-green-400" :
                    application.matchScore >= 40 ? "text-orange-400" :
                    "text-red-400"
                  }`}>
                    {application.matchScore}%
                  </span>
                  <div className="w-12 h-1 bg-[#1e293b] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        application.matchScore >= 75 ? "bg-green-500" :
                        application.matchScore >= 40 ? "bg-orange-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(application.matchScore, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {application?.job?.candidatePosted?.name && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <User size={13} className="text-slate-500" />
                  <span>Referrer: <span className="text-white font-medium text-xs">{application.job.candidatePosted.name}</span></span>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge - Compact */}
          <div className="flex-shrink-0">
            <div className={`px-3 py-1.5 rounded-full border font-medium text-[11px] ${getStatusColor(application.currentStatus)}`}>
              {application.currentStatus}
            </div>
          </div>
        </div>

        {/* Posted By Referrer Section - Compact */}
        {application.job?.receiverProfile && (
          <div className="mt-4 rounded-xl border border-[#1e293b] bg-[#111827]/50 p-3 hover:border-[#2a3a5a] transition-colors duration-300">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <User size={12} className="text-slate-500" />
              <span className="font-medium">Referrer Details</span>
            </div>
            <PostedByReferrer candidateId={application.job.receiverProfile.userId} />
          </div>
        )}
      </div>

      {/* Timeline Section - Compact */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#0f172a] to-[#1a2332] p-5 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Clock size={15} className="text-slate-400" />
            Progress Timeline
          </h2>
          {application.statusHistory && (
            <span className="text-[10px] text-slate-500">
              {application.statusHistory.length} step{application.statusHistory.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <ApplicationTimeline
          currentStatus={application.currentStatus}
        />
      </div>

      {/* Additional Info Sections - Compact */}
      <div className="mt-4 space-y-4">
        {/* Job Description */}
        {jobDetails?.description && (
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#0f172a] to-[#1a2332] p-5 sm:p-6 shadow-lg">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Briefcase size={15} className="text-slate-400" />
              Job Description
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {jobDetails.description}
            </p>
          </div>
        )}

        {/* Skills Section - Compact */}
        {jobDetails?.skills && jobDetails.skills.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#0f172a] to-[#1a2332] p-5 sm:p-6 shadow-lg">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Award size={15} className="text-slate-400" />
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {jobDetails.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info: Package & Experience */}
        {(jobDetails?.packageDetails || jobDetails?.yearsOfExperience) && (
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#0f172a] to-[#1a2332] p-5 sm:p-6 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {jobDetails?.packageDetails?.totalCTC && (
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Package</p>
                  <p className="text-sm text-white font-medium">
                    {jobDetails.packageDetails.currency} {jobDetails.packageDetails.totalCTC} LPA
                  </p>
                </div>
              )}
              {jobDetails?.yearsOfExperience && (
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Experience</p>
                  <p className="text-sm text-white font-medium">{jobDetails.yearsOfExperience}</p>
                </div>
              )}
              {jobDetails?.employmentType && jobDetails.employmentType.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Employment Type</p>
                  <p className="text-sm text-white font-medium">{jobDetails.employmentType.join(", ")}</p>
                </div>
              )}
              {jobDetails?.workMode && jobDetails.workMode.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Work Mode</p>
                  <p className="text-sm text-white font-medium">{jobDetails.workMode.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}