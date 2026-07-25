import {
  Mail,
  Globe,
  FileText,
  Link,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { AlumniDetailProfileProps } from "@/types/alumni";
import ResumeModal from "@/components/profile/ResumeModal";

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

  const handleResumeClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    setResumeUrl(url);
    setResumeModalOpen(true);
  };

  const handleCloseModal = () => {
    setResumeModalOpen(false);
    setResumeUrl(null);
  };

  return (
    <>
      <div className="surface-card rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg transition hover:border-[var(--primary-border)]">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[var(--primary)] [&_svg]:h-5 [&_svg]:w-5">
            <Link className="h-5 w-5" />
          </span>
          <h2 className="text-base font-bold text-[var(--text-primary)]">Professional Links</h2>
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
                    className="group flex w-full items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--background-soft)] p-4 transition-all duration-300 hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:shadow-md"
                  >
                    <div className="rounded-lg bg-[var(--primary-soft)] p-2 text-[var(--primary)] transition group-hover:bg-[var(--primary-soft)]/80">
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
                      <p className="truncate text-sm text-[var(--text-primary)] transition group-hover:text-[var(--primary)]">
                        {getResumeDisplayName(item.href)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                      <Eye className="h-4 w-4 text-[var(--primary)]" />
                      <span className="text-xs text-[var(--primary)]">View</span>
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
                  className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--background-soft)] p-4 transition-all duration-300 hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:shadow-md"
                >
                  <div className="rounded-lg bg-[var(--primary-soft)] p-2 text-[var(--primary)] transition group-hover:bg-[var(--primary-soft)]/80">
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
                    <p className="truncate text-sm text-[var(--text-primary)] transition group-hover:text-[var(--primary)]">
                      {item.value}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Link className="mx-auto mb-2 h-8 w-8 text-[var(--text-muted)]/30" />
            <p className="text-[var(--text-muted)]">No professional links available.</p>
          </div>
        )}
      </div>

      {/* Resume Modal */}
      {resumeModalOpen && resumeUrl && (
        <ResumeModal
          resumeUrl={resumeUrl}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}