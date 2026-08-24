// app/jobs/[jobId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  GraduationCap,
  MessageCircle, 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  CheckCircle,
  Award,
  Sparkles,
  Building2,
  Globe,
  Calendar,
  Users,
  TrendingUp,
  Share2,
  Bookmark,
  Eye,
  Mail,
  Phone,
} from "lucide-react";

interface JobDetails {
  _id: string;
  jobTitle: string[];
  companyName: string;
  description: string;
  location: string[];
  employmentType: string[];
  workMode: string[];
  packageDetails: {
    currency: string;
    totalCTC: number;
    fixedPay: number;
    joiningBonus: number;
  };
  skills: string[];
  benefits: string[];
  tags: string[];
  yearsOfExperience: string;
  minEducation: string;
  numberOfOpenings: number;
  rounds: string[];
  selectionProcess: string[];
  eligibilityCriteria: string;
  status: string;
  matchScore: number;
  views:string;
  candidatePosted: {
    _id?: string;
    name: string;
    currentCompany: string;
    profileImage?: string;
    experiences: Array<{
      company: string;
      role: string;
      startDate: string;
      endDate: string;
      isCurrent: boolean;
    }>;
    jobRoles: string[];
  };
  postedByUser: string;
  createdAt: string;
  updatedAt: string;
  metrics: {
    totalApplicationsReceived: number;
    totalReferredToCompany: number;
    totalInterviewScheduled: number;
    totalAcceptedByCompany: number;
    responseRate: number;
    referralSuccessRate: number;
  };
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const jobId = params?.jobId as string;

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  async function fetchJobDetails() {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/jobs/jobDetails/referral/${jobId}`
      );
      setJobDetails(response.data?.data || response.data);
    } catch (err) {
      console.error("Failed to fetch job details", err);
      setError("Failed to load job details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleApply = () => {
    if (isApplying) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=/jobs/${jobId}`);
      return;
    }

    if (role && jobDetails) {
      setIsApplying(true);
      const matchScore = jobDetails.matchScore || 0;
      router.push(
        `/${role}/jobs/referral-jobs/${jobId}?matchScore=${matchScore}`
      );
    }
  };

  const handleViewProfile = () => {
    const userId = jobDetails?.candidatePosted?._id || jobDetails?.postedByUser;
    if (!userId) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=/profile/${userId}`);
      return;
    }
    router.push(`${role}/profile/${userId}`);
  };

  const handleMessage = () => {
    const userId = jobDetails?.candidatePosted?._id || jobDetails?.postedByUser;
    if (!userId) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=/messages/${userId}`);
      return;
    }
    router.push(`${role}/messages/${userId}`);
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/jobs/${jobId}`);
      return;
    }
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: jobDetails?.jobTitle?.[0] || 'Job Opportunity',
        text: `Check out this job at ${jobDetails?.companyName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSalary = (amount: number) => {
    if (amount === 0) return "Equity Only";
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} LPA`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="app-background min-h-screen px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent"></div>
              <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full bg-[var(--primary-soft)] blur-xl"></div>
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)] animate-pulse">
              Loading job details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !jobDetails) {
    return (
      <div className="app-background min-h-screen px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="surface-card p-12 text-center">
            <div className="mb-4 text-7xl">🔍</div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              Job Not Found
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {error || "The job you're looking for doesn't exist or has been removed."}
            </p>
            <Link
              href="/"
              className="btn-primary mt-6 inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-background min-h-screen">
      {/* Professional Job Details Layout */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Bar - Like LinkedIn */}
        <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to jobs</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-all ${
                isSaved
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-[var(--primary)]' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </div>
        </div>

        {/* Main Job Card - Like LinkedIn/Indeed */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
          {/* Job Title & Company */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
                  {jobDetails.jobTitle?.[0] || "Job Opportunity"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--primary)]">
                  <TrendingUp className="h-3 w-3" />
                  {jobDetails.matchScore || 0}% Match
                </span>
              </div>
              
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-base font-medium text-[var(--text-secondary)]">
                  <Building2 className="h-4 w-4 text-[var(--primary)]" />
                  {jobDetails.candidatePosted?.currentCompany || jobDetails.companyName || 'Company'}
                </span>
                <span className="h-1 w-1 rounded-full bg-[var(--border)]"></span>
                <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                  <MapPin className="h-4 w-4 text-[var(--primary)]" />
                  {jobDetails.location?.[0] || "Remote"}
                </span>
                {jobDetails.workMode?.[0] && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[var(--border)]"></span>
                    <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                      <Globe className="h-4 w-4 text-[var(--primary)]" />
                      {jobDetails.workMode[0]}
                    </span>
                  </>
                )}
              </div>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {jobDetails.employmentType?.map((type) => (
                  <span key={type} className="badge badge-primary text-xs">
                    {type}
                  </span>
                ))}
                {jobDetails.tags?.map((tag) => (
                  <span key={tag} className="badge text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Posted Date */}
              <div className="mt-3 flex items-center gap-1 text-xs text-[var(--text-subtle)]">
                <Calendar className="h-3 w-3" />
                Posted {formatDate(jobDetails.createdAt)}
                <span className="mx-1">•</span>
                <Eye className="h-3 w-3" />
                {jobDetails?.views || 0} views
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="w-full rounded-md bg-[var(--primary)] px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--primary-hover)] hover:shadow-md disabled:opacity-50 lg:w-auto"
              >
                {isApplying ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Applying...
                  </span>
                ) : (
                  'Apply Now'
                )}
              </button>
              <p className="text-xs text-[var(--text-subtle)]">
                {jobDetails.numberOfOpenings || 0} positions available
              </p>
            </div>
          </div>

          {/* Posted By Section - Professional */}
          {jobDetails.candidatePosted && (
            <div className="mt-6 flex flex-col gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-base font-bold text-white shadow-sm">
                    {jobDetails.candidatePosted.profileImage ? (
                      <img
                        src={jobDetails.candidatePosted.profileImage}
                        alt={jobDetails.candidatePosted.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(jobDetails.candidatePosted.name)
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-[var(--success)] p-0.5 ring-2 ring-[var(--card)]">
                    <CheckCircle className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {jobDetails.candidatePosted.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {jobDetails.candidatePosted.currentCompany}
                  </p>
                  <p className="text-xs text-[var(--text-subtle)]">
                    {jobDetails.candidatePosted.experiences?.[0]?.role || 'Professional'}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleViewProfile}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
                >
                  <User className="h-3.5 w-3.5" />
                  View Profile
                </button>
                <button
                  onClick={handleMessage}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-[var(--primary-hover)] hover:shadow-sm"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Message
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Two Column Layout - Like Professional Job Sites */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Main Content - Left Side (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                About the Role
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                <p className="whitespace-pre-wrap">
                  {jobDetails.description}
                </p>
              </div>
            </div>

            {/* Eligibility */}
            {jobDetails.eligibilityCriteria && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">
                  Eligibility Criteria
                </h2>
                <div className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  <p className="whitespace-pre-wrap">
                    {jobDetails.eligibilityCriteria}
                  </p>
                </div>
              </div>
            )}

            {/* Skills */}
            {jobDetails.skills && jobDetails.skills.length > 0 && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">
                  Required Skills
                </h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {jobDetails.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-[var(--background-soft)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {jobDetails.benefits && jobDetails.benefits.length > 0 && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">
                  Benefits
                </h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {jobDetails.benefits.map((benefit) => (
                    <span key={benefit} className="badge badge-success text-xs">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Selection Process */}
            {jobDetails.selectionProcess && jobDetails.selectionProcess.length > 0 && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">
                  Selection Process
                </h2>
                <div className="mt-3 space-y-2">
                  {jobDetails.selectionProcess.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-semibold text-[var(--primary)]">
                        {index + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side (1/3) */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Job Overview
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-xs text-[var(--text-secondary)]">Experience</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {jobDetails.yearsOfExperience || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-xs text-[var(--text-secondary)]">Education</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {jobDetails.minEducation || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-xs text-[var(--text-secondary)]">Openings</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {jobDetails.numberOfOpenings || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)]">Salary</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {formatSalary(jobDetails.packageDetails?.totalCTC || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-center shadow-sm">
                <Briefcase className="mx-auto h-5 w-5 text-[var(--primary)]" />
                <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">
                  {jobDetails.metrics?.totalApplicationsReceived || 0}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Applications</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-center shadow-sm">
                <Users className="mx-auto h-5 w-5 text-[var(--primary)]" />
                <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">
                  {jobDetails.metrics?.responseRate || 0}%
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Response Rate</p>
              </div>
            </div>

            {/* Referral Info */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--primary-soft)] p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-[var(--primary)] p-1.5">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Referral Job
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    This job is posted by an employee who can refer you directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}