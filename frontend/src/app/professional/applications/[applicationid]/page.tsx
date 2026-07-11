"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostedByReferrer from "@/components/dashboard/PostedByReferrer";
import { ArrowLeft, Building2, Calendar, User, Briefcase, Clock, MapPin, Mail, Phone, Award, Target, DollarSign, Users, CheckCircle, XCircle, Clock as ClockIcon } from "lucide-react";
import { getApplicationDetails } from "@/services/application.service";
import ApplicationTimeline from "@/components/applications/ApplicationTimeline";

export default function ApplicationDetailsPage() {
  const { applicationid } = useParams();
  const router = useRouter();

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getApplicationDetails(applicationid as string);
        let data = res.data;
        setApplication(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [applicationid]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-3 py-4">
        <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-8 text-center">
          <div className="flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500"></div>
            <span className="ml-2.5 text-xs text-gray-400">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-3 py-4">
        <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-8 text-center">
          <p className="text-sm text-gray-400">Application not found</p>
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    if (status === "Accepted" || status === "Offer Accepted") return <CheckCircle className="w-3.5 h-3.5" />;
    if (status === "Rejected" || status === "Offer Rejected") return <XCircle className="w-3.5 h-3.5" />;
    return <ClockIcon className="w-3.5 h-3.5" />;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 py-3">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-1.5 text-gray-400 hover:text-white transition-all duration-200 mb-3"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-[11px] font-medium">Back</span>
      </button>

      {/* Main Header Card */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-[#0f172a] to-[#1a2332] p-4 mb-3 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Job Title & Company */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                {jobDetails?.jobTitle?.[0] || "Application"}
              </h1>
              {application.jobType && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border flex-shrink-0 ${
                  application.jobType === "Referral" 
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/30" 
                    : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                }`}>
                  {application.jobType}
                </span>
              )}
            </div>

            {/* Company & Location */}
            <div className="flex flex-wrap items-center gap-2 text-slate-400 text-xs">
              <div className="flex items-center gap-1">
                <Building2 size={12} className="text-slate-500" />
                <span>{jobDetails?.companyName || "Company"}</span>
              </div>
              {jobDetails?.location && jobDetails.location.length > 0 && (
                <div className="flex items-center gap-1">
                  <MapPin size={11} className="text-slate-500" />
                  <span className="text-[11px]">{jobDetails.location.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Job Details Grid - Compact */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px]">
              <div className="flex items-center gap-1 text-slate-400">
                <Calendar size={11} className="text-slate-500" />
                <span>{formatDate(application.createdAt)}</span>
              </div>

              {application.matchScore > 0 && (
                <div className="flex items-center gap-1">
                  <Target size={11} className="text-slate-500" />
                  <span className={`font-semibold text-[11px] ${
                    application.matchScore >= 75 ? "text-green-400" :
                    application.matchScore >= 40 ? "text-orange-400" :
                    "text-red-400"
                  }`}>
                    {application.matchScore}%
                  </span>
                  <div className="w-10 h-1 bg-[#1e293b] rounded-full overflow-hidden">
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

              {jobDetails?.employmentType && jobDetails.employmentType.length > 0 && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Briefcase size={11} className="text-slate-500" />
                  <span>{jobDetails.employmentType.join(", ")}</span>
                </div>
              )}

              {jobDetails?.workMode && jobDetails.workMode.length > 0 && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock size={11} className="text-slate-500" />
                  <span>{jobDetails.workMode.join(", ")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge - Compact */}
          <div className="flex-shrink-0">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-medium text-[10px] ${getStatusColor(application.currentStatus)}`}>
              {getStatusIcon(application.currentStatus)}
              {application.currentStatus}
            </div>
          </div>
        </div>

        {/* Posted By Referrer Section - Compact */}
        {application.job?.receiverProfile && (
          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1.5">
              <User size={11} className="text-slate-500" />
              <span className="font-medium">Referrer Details</span>
            </div>
            <PostedByReferrer candidateId={application.job.receiverProfile.userId} />
          </div>
        )}
      </div>

      {/* Two Column Layout - Timeline & Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Timeline Section - Compact */}
        <div className="lg:col-span-1 rounded-xl border border-slate-800 bg-gradient-to-br from-[#0f172a] to-[#1a2332] p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <ClockIcon size={12} className="text-slate-400" />
              Timeline
            </h2>
            {application.statusHistory && (
              <span className="text-[9px] text-slate-500">
                {application.statusHistory.length} step{application.statusHistory.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <ApplicationTimeline
            currentStatus={application.currentStatus}
          />
        </div>

        {/* Right Column - Additional Info */}
        <div className="lg:col-span-2 space-y-3">
          {/* Job Description */}
          {jobDetails?.description && (
            <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-[#0f172a] to-[#1a2332] p-4 shadow-lg">
              <h2 className="text-xs font-semibold text-white flex items-center gap-1.5 mb-2">
                <Briefcase size={12} className="text-slate-400" />
                Job Description
              </h2>
              <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                {jobDetails.description}
              </p>
            </div>
          )}

          {/* Skills Section - Compact */}
          

          {/* Additional Info: Package & Experience */}
          {(jobDetails?.packageDetails?.totalCTC || jobDetails?.yearsOfExperience || jobDetails?.numberOfOpenings) && (
            <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-[#0f172a] to-[#1a2332] p-4 shadow-lg">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {jobDetails?.packageDetails?.totalCTC && (
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Package</p>
                    <p className="text-xs text-white font-medium">
                      {jobDetails.packageDetails.currency} {jobDetails.packageDetails.totalCTC} LPA
                    </p>
                  </div>
                )}
                {jobDetails?.yearsOfExperience && (
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Experience</p>
                    <p className="text-xs text-white font-medium">{jobDetails.yearsOfExperience}</p>
                  </div>
                )}
                {jobDetails?.numberOfOpenings && (
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Openings</p>
                    <p className="text-xs text-white font-medium">{jobDetails.numberOfOpenings}</p>
                  </div>
                )}
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}