"use client";

import { ApplicationDetailSocialLinksProps } from "@/types/applications";
import { FileText } from "lucide-react";

export default function ApplicationDetailSocialLinks({
  applicant,
}: ApplicationDetailSocialLinksProps) {
  const links = [
    {
      label: "LinkedIn",
      value: applicant?.linkedin,
    },
    {
      label: "GitHub",
      value: applicant?.github,
    },
    {
      label: "Portfolio",
      value: applicant?.portfolio,
    },
    {
      label: "Resume",
      value: applicant?.resume,
    },
  ].filter((item) => item.value);

  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-800
        p-6
      "
    >
      <h2 className="text-xl font-semibold mb-6 text-blue-400">
        Social Links & Documents
      </h2>

      {links.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.value}
              target="_blank"
              rel="noopener noreferrer"
              className="
                rounded-2xl
                border
                border-slate-700
                p-4
                transition
                block
              "
            >
              <p className="text-sm text-slate-200">
                {link.label}
              </p>

              <p
                className="
                  mt-1
                  text-slate-400
                  truncate
                "
                style={{color: "#94a3b8",transition: "color 0.2s ease",cursor: "pointer"}}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#22c55e";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#94a3b8";
                }}
              >
                {link.label === "Resume" ? (
                <span className="flex items-center gap-2 text-green-400">
                <FileText size={16} />
                View Resume
                </span>
                ) : (link.value)}
              </p>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">
          No social links available
        </p>
      )}
    </div>
  );
}