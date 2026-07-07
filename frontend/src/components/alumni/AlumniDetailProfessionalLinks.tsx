import {
  Mail,
  Globe,
  FileText,
  Link,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { AlumniDetailProfileProps } from "@/types/alumni";
import ResumeModal from "@/components/profile/ResumeModal"; // Adjust the import path as needed

export default function AlumniDetailProfessionalLinks({
  profile,
}: AlumniDetailProfileProps) {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  const links = [
    {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: Mail,
      isResume: false,
    },
    {
      label: "LinkedIn",
      value: profile.linkedin,
      href: profile.linkedin,
      icon: Globe,
      isResume: false,
    },
    {
      label: "GitHub",
      value: profile.github,
      href: profile.github,
      icon: Link,
      isResume: false,
    },
    {
      label: "Resume",
      value: profile.resume,
      href: profile.resume,
      icon: FileText,
      isResume: true,
    },
  ].filter((item) => item.value);

  // Get display filename for resume button
  const getResumeDisplayName = (url: string): string => {
    if (!url) return "No resume";
    let fileName = url.split("/").pop()?.split("?")[0] || "resume";
    fileName = fileName.split("?")[0];
    fileName = fileName.replace(/\s+/g, "_").replace(/[^\w.-]/g, "_");
    
    if (!fileName.toLowerCase().endsWith(".pdf")) {
      const lastDotIndex = fileName.lastIndexOf(".");
      if (lastDotIndex > 0) {
        fileName = fileName.substring(0, lastDotIndex);
      }
      return `${fileName}.pdf`;
    }
    return fileName.length > 40 ? `${fileName.substring(0, 37)}...` : fileName;
  };

  // Handle resume view - opens the ResumeModal
  const handleResumeClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    setResumeUrl(url);
    setResumeModalOpen(true);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setResumeModalOpen(false);
    setResumeUrl(null);
  };

  return (
    <>
      <div className="rounded-3xl border border-[#242d3a] bg-[#111821] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition hover:border-[#2fb344]/40">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[#2fb344] [&_svg]:h-5 [&_svg]:w-5">
            <Link className="h-5 w-5" />
          </span>
          <h2 className="text-[16px] font-bold text-white">Professional Links</h2>
        </div>

        {links.length ? (
          <div className="space-y-3">
            {links.map((item) => {
              const Icon = item.icon;

              if (item.isResume) {
                return (
                  <button
                    key={item.label}
                    onClick={(e) => handleResumeClick(e, item.href)}
                    className="group flex w-full items-center gap-4 rounded-xl border border-[#242d3a] bg-[#0a0f16] p-4 transition-all duration-300 hover:border-[#2fb344] hover:bg-[#2fb344]/5 hover:shadow-md hover:shadow-[#2fb344]/5"
                  >
                    <div className="rounded-lg bg-[#2fb344]/10 p-2 text-[#2fb344] transition group-hover:bg-[#2fb344]/20">
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-sm text-[#94a3b8]">{item.label}</p>
                      <p className="truncate text-[13px] text-white group-hover:text-[#2fb344] transition">
                        {getResumeDisplayName(item.href)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                      <Eye className="h-4 w-4 text-[#2fb344]" />
                      <span className="text-xs text-[#2fb344]">View</span>
                    </div>
                  </button>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-[#242d3a] bg-[#0a0f16] p-4 transition-all duration-300 hover:border-[#2fb344] hover:bg-[#2fb344]/5 hover:shadow-md hover:shadow-[#2fb344]/5"
                >
                  <div className="rounded-lg bg-[#2fb344]/10 p-2 text-[#2fb344] transition group-hover:bg-[#2fb344]/20">
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#94a3b8]">{item.label}</p>
                    <p className="truncate text-[13px] text-white group-hover:text-[#2fb344] transition">
                      {item.value}
                    </p>
                  </div>

                  
                </a>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Link className="mx-auto h-8 w-8 text-[#64748b]/30 mb-2" />
            <p className="text-[#94a3b8]">No professional links available.</p>
          </div>
        )}
      </div>

      {/* Resume Modal - ResumeModal handles everything */}
      {resumeModalOpen && resumeUrl && (
        <ResumeModal
          resumeUrl={resumeUrl}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}