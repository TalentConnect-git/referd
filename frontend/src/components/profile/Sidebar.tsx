"use client";

import {
  Trophy,
  CheckCircle2,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
  Award,
  Star,
  Bookmark,
  ExternalLink,
  Eye,
  Users,
  Briefcase,
  Send,
  UserCheck,
  Clock,
  BarChart,
  Calendar,
  FileCheck,
  TrendingUp,
  User,
  GraduationCap,
  Briefcase as BriefcaseIcon,
  Upload,
  Loader2,
} from "lucide-react";

import SideCard from "./SideCard";
import MiniStat from "./MiniStat";
import ConnectedItem from "./ConnectedItem";
import Info from "./Info";
import SmallTagBlock from "./SmallTagBlock";
import Empty from "./Empty";
import LinkedinIcon from "./LinkedinIcon";
import GithubIcon from "./GithubIcon";

import type { ProfileData } from "@/types/profile";
import { toArray } from "@/helper/index";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

interface SidebarProps {
  profile: ProfileData;
  resumeModalOpen: boolean;
  setResumeModalOpen: (open: boolean) => void;
  onProfileUpdate?: (updatedProfile: ProfileData) => void;
}

interface ProfessionalStats {
  totalReferralsPosted: number;
  totalApplicationsReceived: number;
  totalReferredToCompany: number;
  totalAcceptedByCompany: number;
  responseRate: number;
  referralSuccessRate: number;
}

interface CandidateStats {
  savedCount: number;
  totalApplications: number;
  referralApplications: number;
}

interface CareerInsights {
  resumeScore: number;
  hiringScore: number;
  interviews: any[];
}

function getResumeFileName(profile: ProfileData): string {
  const rawName =
    profile.resume?.split("/").pop()?.split("?")[0] ||
    `resume_${profile._id || profile.userId || Date.now()}`;

  const cleanName = rawName.replace(/\s+/g, "_").replace(/[^\w.-]/g, "_");

  return cleanName.toLowerCase().endsWith(".pdf")
    ? cleanName
    : `${cleanName}.pdf`;
}

export default function Sidebar({ 
  profile, 
  setResumeModalOpen,
  onProfileUpdate 
}: SidebarProps) {
  const resumeUrl = profile.resume;
  const hasResume = Boolean(resumeUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Determine profile type
  const isProfessional = profile.profileType === "professional";

  const [professionalStats, setProfessionalStats] = useState<ProfessionalStats>(
    {
      totalReferralsPosted: 0,
      totalApplicationsReceived: 0,
      totalReferredToCompany: 0,
      totalAcceptedByCompany: 0,
      responseRate: 0,
      referralSuccessRate: 0,
    },
  );

  const [candidateStats, setCandidateStats] = useState<CandidateStats>({
    savedCount: 0,
    totalApplications: 0,
    referralApplications: 0,
  });

  const [careerInsights, setCareerInsights] = useState<CareerInsights>({
    resumeScore: 0,
    hiringScore: 0,
    interviews: [],
  });

  const [interviewCount, setInterviewCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching stats for profile type:", isProfessional ? "Professional" : "Candidate/Student");

        if (isProfessional) {
          console.log("📡 Calling professional stats API...");
          const response = await axiosInstance.get(
            "/application/professional/referral-metrics"
          );
          console.log("✅ Professional stats response:", response.data);
          
          if (response.data?.data) {
            setProfessionalStats(response.data.data);
          } else if (response.data) {
            setProfessionalStats(response.data);
          }
        } else {
          console.log("📡 Calling candidate stats API...");
          try {
            const candidateResponse = await axiosInstance.get(
              "/application/dashboard/candidate/stats"
            );
            console.log("✅ Candidate stats response:", candidateResponse.data);
            
            if (candidateResponse.data?.data) {
              setCandidateStats(candidateResponse.data.data);
            } else if (candidateResponse.data) {
              setCandidateStats(candidateResponse.data);
            }
          } catch (candidateError) {
            console.error("❌ Error fetching candidate stats:", candidateError);
          }

          console.log("📡 Calling career insights API...");
          try {
            const careerResponse = await axiosInstance.get(
              "/api/career-insights"
            );
            console.log("✅ Career insights response:", careerResponse.data);
            
            if (careerResponse.data?.data) {
              setCareerInsights(careerResponse.data.data);
            } else if (careerResponse.data) {
              setCareerInsights(careerResponse.data);
            }
          } catch (careerError) {
            console.error("❌ Error fetching career insights:", careerError);
          }

          console.log("📡 Calling interviews API...");
          try {
            const interviewResponse = await axiosInstance.get("/interviews");
            console.log("✅ Interviews response:", interviewResponse.data);
            
            if (interviewResponse.data?.data) {
              const interviews = interviewResponse.data.data;
              setInterviewCount(Array.isArray(interviews) ? interviews.length : 0);
              console.log("📊 Interview count:", Array.isArray(interviews) ? interviews.length : 0);
            } else {
              setInterviewCount(0);
            }
          } catch (interviewError) {
            console.error("❌ Error fetching interviews:", interviewError);
            setInterviewCount(0);
          }
        }
      } catch (error: any) {
        console.error("❌ Error fetching stats:", error);
        if (error?.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        } else if (error?.request) {
          console.error("No response received from server");
        } else {
          console.error("Error message:", error?.message || "Unknown error");
        }
      } finally {
        setLoading(false);
        console.log("🏁 Stats fetching completed");
      }
    };

    fetchStats();
  }, [isProfessional]);

  const data = {
    locations: toArray(profile.locations),
    jobRoles: toArray(profile.jobRoles),
    lookingFor: toArray(profile.lookingFor),
    employmentTypes: toArray(profile.employmentType),
    tools: toArray(profile.toolsAndPlatforms),
    domains: toArray(profile.domainKnowledge),
    languages: toArray(profile.languagesKnown),
  };

  const handleViewResume = (): void => {
    if (!resumeUrl) {
      toast.error("Resume URL not found");
      return;
    }

    setResumeModalOpen(true);
  };

  const handleDownloadResume = async (): Promise<void> => {
    if (!resumeUrl) {
      toast.error("Resume URL not found");
      return;
    }

    try {
      console.log("📥 Downloading resume from:", resumeUrl);
      const response = await fetch(resumeUrl);

      if (!response.ok) {
        throw new Error("Failed to download resume");
      }

      const blob = await response.blob();

      const pdfBlob =
        blob.type === "application/pdf"
          ? blob
          : new Blob([blob], { type: "application/pdf" });

      const blobUrl = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = getResumeFileName(profile);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      
      console.log("✅ Resume downloaded successfully");
      toast.success("Resume downloaded successfully");
    } catch (error) {
      console.error("❌ Resume download failed:", error);
      window.open(resumeUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axiosInstance.put("/api/onboarding/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success || response.data?.message) {
        const updatedProfile = response.data.data || response.data.message || response.data;
        
        toast.success("Resume uploaded successfully");
        
        // Update parent component with new profile data
        if (onProfileUpdate && updatedProfile) {
          onProfileUpdate(updatedProfile);
        }
        
        // Refresh the page or update local state
        window.location.reload();
      } else {
        throw new Error(response.data?.msg || "Failed to upload resume");
      }
    } catch (error: any) {
      console.error("❌ Resume upload failed:", error);
      toast.error(error?.response?.data?.msg || "Failed to upload resume");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Professional Stats Boxes
  const professionalStatBoxes = [
    {
      id: "referrals-posted",
      label: "Referrals Posted",
      value: professionalStats.totalReferralsPosted ?? 0,
      icon: <Send className="h-5 w-5" />,
      color: "text-[#60a5fa]",
      bgColor: "bg-[#60a5fa]/10",
      borderColor: "border-[#60a5fa]/20",
    },
    {
      id: "applications-received",
      label: "Applications Received",
      value: professionalStats.totalApplicationsReceived ?? 0,
      icon: <Users className="h-5 w-5" />,
      color: "text-[#a78bfa]",
      bgColor: "bg-[#a78bfa]/10",
      borderColor: "border-[#a78bfa]/20",
    },
    {
      id: "referred-to-company",
      label: "Referred to Company",
      value: professionalStats.totalReferredToCompany ?? 0,
      icon: <Briefcase className="h-5 w-5" />,
      color: "text-[#34d399]",
      bgColor: "bg-[#34d399]/10",
      borderColor: "border-[#34d399]/20",
    },
    {
      id: "accepted-by-company",
      label: "Accepted by Company",
      value: professionalStats.totalAcceptedByCompany ?? 0,
      icon: <UserCheck className="h-5 w-5" />,
      color: "text-[#2fb344]",
      bgColor: "bg-[#2fb344]/10",
      borderColor: "border-[#2fb344]/20",
    },
    {
      id: "response-rate",
      label: "Response Rate",
      value: `${professionalStats.responseRate ?? 0}%`,
      icon: <Clock className="h-5 w-5" />,
      color: "text-[#fbbf24]",
      bgColor: "bg-[#fbbf24]/10",
      borderColor: "border-[#fbbf24]/20",
    },
    {
      id: "success-rate",
      label: "Success Rate",
      value: `${professionalStats.referralSuccessRate ?? 0}%`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-[#fb7185]",
      bgColor: "bg-[#fb7185]/10",
      borderColor: "border-[#fb7185]/20",
    },
  ];

  // Candidate Stats Boxes
  const candidateStatBoxes = [
    {
      id: "saved",
      label: "Saved Jobs",
      value: candidateStats.savedCount ?? 0,
      icon: <Bookmark className="h-5 w-5" />,
      color: "text-[#60a5fa]",
      bgColor: "bg-[#60a5fa]/10",
      borderColor: "border-[#60a5fa]/20",
    },
    {
      id: "applications",
      label: "Applications",
      value: candidateStats.totalApplications ?? 0,
      icon: <FileCheck className="h-5 w-5" />,
      color: "text-[#a78bfa]",
      bgColor: "bg-[#a78bfa]/10",
      borderColor: "border-[#a78bfa]/20",
    },
    {
      id: "referrals",
      label: "Referral Apps",
      value: candidateStats.referralApplications ?? 0,
      icon: <Users className="h-5 w-5" />,
      color: "text-[#34d399]",
      bgColor: "bg-[#34d399]/10",
      borderColor: "border-[#34d399]/20",
    },
    {
      id: "resume-score",
      label: "Resume Score",
      value: `${careerInsights.resumeScore ?? 0}%`,
      icon: <FileText className="h-5 w-5" />,
      color: "text-[#22d3ee]",
      bgColor: "bg-[#22d3ee]/10",
      borderColor: "border-[#22d3ee]/20",
    },
    {
      id: "hiring-score",
      label: "Hiring Score",
      value: `${careerInsights.hiringScore ?? 0}%`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-[#fb923c]",
      bgColor: "bg-[#fb923c]/10",
      borderColor: "border-[#fb923c]/20",
    },
    {
      id: "interviews",
      label: "Interviews",
      value: interviewCount,
      icon: <Calendar className="h-5 w-5" />,
      color: "text-[#fb7185]",
      bgColor: "bg-[#fb7185]/10",
      borderColor: "border-[#fb7185]/20",
    },
  ];

  console.log("📊 Current Professional Stats:", professionalStats);
  console.log("📊 Current Candidate Stats:", candidateStats);
  console.log("📊 Current Career Insights:", careerInsights);
  console.log("📊 Interview Count:", interviewCount);

  return (
    <aside className="space-y-6">
      {/* Conditional Stats Section */}
      {isProfessional ? (
        <section className="rounded-3xl border border-[#242d3a] bg-[#111821] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition hover:border-[#2fb344]/40">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-[#2fb344] [&_svg]:h-5 [&_svg]:w-5">
              <Briefcase className="h-5 w-5" />
            </span>
            <h2 className="text-[16px] font-bold text-white">Professional Stats</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2fb344] border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {professionalStatBoxes.map((stat) => (
                <div
                  key={stat.id}
                  className={`rounded-xl border ${stat.borderColor} ${stat.bgColor} p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#2fb344]/5`}
                >
                  <div className="flex items-center gap-2">
                    <div className={stat.color}>{stat.icon}</div>
                    <span className="text-xs text-[#94a3b8] font-medium">
                      {stat.label}
                    </span>
                  </div>
                  <div
                    className={`mt-1 text-lg font-bold text-white ${stat.color}`}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="rounded-3xl border border-[#242d3a] bg-[#111821] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition hover:border-[#2fb344]/40">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-[#2fb344] [&_svg]:h-5 [&_svg]:w-5">
              <BarChart className="h-5 w-5" />
            </span>
            <h2 className="text-[16px] font-bold text-white">Career Dashboard</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2fb344] border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {candidateStatBoxes.map((stat) => (
                <div
                  key={stat.id}
                  className={`rounded-xl border ${stat.borderColor} ${stat.bgColor} p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#2fb344]/5`}
                >
                  <div className="flex items-center gap-2">
                    <div className={stat.color}>{stat.icon}</div>
                    <span className="text-xs text-[#94a3b8] font-medium">
                      {stat.label}
                    </span>
                  </div>
                  <div
                    className={`mt-1 text-lg font-bold text-white ${stat.color}`}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Documents - Enhanced with Upload */}
      <section className="rounded-3xl border border-[#242d3a] bg-[#111821] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition hover:border-[#2fb344]/40">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[#2fb344] [&_svg]:h-5 [&_svg]:w-5">
            <FileText className="h-5 w-5" />
          </span>
          <h2 className="text-[16px] font-bold text-white">Documents</h2>
        </div>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleResumeUpload}
          className="hidden"
        />

        {hasResume && resumeUrl ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleViewResume}
              className="group flex w-full items-center gap-3 rounded-xl border border-[#242d3a] bg-[#0a0f16] p-4 text-left transition-all duration-300 hover:border-[#2fb344] hover:bg-[#2fb344]/5 hover:shadow-md hover:shadow-[#2fb344]/5"
            >
              <div className="rounded-lg bg-[#2fb344]/10 p-2 text-[#2fb344] transition group-hover:bg-[#2fb344]/20">
                <FileText className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-white group-hover:text-[#2fb344] transition">
                  View Resume
                </p>
                <p className="text-[11px] text-[#64748b]">
                  Click to preview PDF
                </p>
              </div>

              <Eye className="h-4 w-4 text-[#64748b] opacity-0 transition group-hover:opacity-100" />
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDownloadResume}
                className="group flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#242d3a] bg-[#0a0f16] py-3 text-[13px] font-bold text-white transition-all duration-300 hover:border-[#2fb344] hover:bg-[#2fb344]/5 hover:text-[#2fb344] hover:shadow-md hover:shadow-[#2fb344]/5"
              >
                <Download className="h-4 w-4 transition group-hover:scale-110" />
                Download
              </button>

              <button
                type="button"
                onClick={handleUploadClick}
                disabled={isUploading}
                className="group flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#242d3a] bg-[#0a0f16] py-3 text-[13px] font-bold text-white transition-all duration-300 hover:border-[#2fb344] hover:bg-[#2fb344]/5 hover:text-[#2fb344] hover:shadow-md hover:shadow-[#2fb344]/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 transition group-hover:scale-110" />
                    Update
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* FIXED: Removed nested p/div structure */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-[#242d3a] bg-[#0a0f16] py-6 text-center">
              <FileText className="h-8 w-8 text-[#64748b]/30 mb-2" />
              <p className="text-[#94a3b8]">No resume uploaded</p>
            </div>
            
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={isUploading}
              className="group w-full flex items-center justify-center gap-2 rounded-xl border border-[#2fb344]/30 bg-[#2fb344]/10 py-3 text-[13px] font-bold text-[#2fb344] transition-all duration-300 hover:bg-[#2fb344]/20 hover:shadow-md hover:shadow-[#2fb344]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Resume
                </>
              )}
            </button>
          </div>
        )}
      </section>

      {/* Connected - Enhanced */}
      <section className="rounded-3xl border border-[#242d3a] bg-[#111821] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition hover:border-[#2fb344]/40">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[#2fb344] [&_svg]:h-5 [&_svg]:w-5">
            <Mail className="h-5 w-5" />
          </span>
          <h2 className="text-[16px] font-bold text-white">Contact Details</h2>
        </div>
        <div className="space-y-3">
          <ConnectedItem
            icon={<Mail className="h-4 w-4 text-[#2fb344]" />}
            value={profile.email}
          />
          <ConnectedItem
            icon={<Phone className="h-4 w-4 text-[#2fb344]" />}
            value={profile.phone}
          />
          <ConnectedItem
            icon={<LinkedinIcon className="h-4 w-4" />}
            value={profile.linkedin}
          />
          <ConnectedItem
            icon={<GithubIcon className="h-4 w-4" />}
            value={profile.github}
          />
          <ConnectedItem
            icon={<MapPin className="h-4 w-4 text-[#2fb344]" />}
            value={data.locations.join(", ")}
          />
        </div>
      </section>

      {/* Career details - Enhanced */}
      <section className="rounded-3xl border border-[#242d3a] bg-[#111821] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition hover:border-[#2fb344]/40">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[#2fb344] [&_svg]:h-5 [&_svg]:w-5">
            <BriefcaseIcon className="h-5 w-5" />
          </span>
          <h2 className="text-[16px] font-bold text-white">Career Details</h2>
        </div>
        <div className="divide-y divide-[#242d3a]/50">
          <Info label="Current Company" value={profile.currentCompany} />
          <Info label="Company Email" value={profile.companyEmail} />
          <Info
            label="Total Experience"
            value={profile.totalYearsOfExperience}
          />
          <Info label="Notice Period" value={profile.noticePeriod} />
          <Info label="Open To Shift" value={profile.openToShift} />
        </div>
      </section>

      {/* Job preferences - Enhanced */}
      <section className="rounded-3xl border border-[#242d3a] bg-[#111821] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition hover:border-[#2fb344]/40">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[#2fb344] [&_svg]:h-5 [&_svg]:w-5">
            <Award className="h-5 w-5" />
          </span>
          <h2 className="text-[16px] font-bold text-white">Job Preferences</h2>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-[#242d3a] bg-[#0a0f16]/50 p-3 transition hover:border-[#2fb344]/20 hover:bg-[#2fb344]/5">
            <SmallTagBlock title="Roles" items={data.jobRoles} />
          </div>
          <div className="rounded-xl border border-[#242d3a] bg-[#0a0f16]/50 p-3 transition hover:border-[#2fb344]/20 hover:bg-[#2fb344]/5">
            <SmallTagBlock title="Looking for" items={data.lookingFor} />
          </div>
          <div className="rounded-xl border border-[#242d3a] bg-[#0a0f16]/50 p-3 transition hover:border-[#2fb344]/20 hover:bg-[#2fb344]/5">
            <SmallTagBlock title="Employment" items={data.employmentTypes} />
          </div>
        </div>
      </section>

      {/* Tools & languages - Enhanced */}
      <section className="rounded-3xl border border-[#242d3a] bg-[#111821] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition hover:border-[#2fb344]/40">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[#2fb344] [&_svg]:h-5 [&_svg]:w-5">
            <GraduationCap className="h-5 w-5" />
          </span>
          <h2 className="text-[16px] font-bold text-white">Tools & Languages</h2>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-[#242d3a] bg-[#0a0f16]/50 p-3 transition hover:border-[#2fb344]/20 hover:bg-[#2fb344]/5">
            <SmallTagBlock title="Tools" items={data.tools} />
          </div>
          <div className="rounded-xl border border-[#242d3a] bg-[#0a0f16]/50 p-3 transition hover:border-[#2fb344]/20 hover:bg-[#2fb344]/5">
            <SmallTagBlock title="Domains" items={data.domains} />
          </div>
          <div className="rounded-xl border border-[#242d3a] bg-[#0a0f16]/50 p-3 transition hover:border-[#2fb344]/20 hover:bg-[#2fb344]/5">
            <SmallTagBlock title="Languages" items={data.languages} />
          </div>
        </div>
      </section>
    </aside>
  );
}