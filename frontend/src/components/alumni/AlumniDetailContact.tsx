"use client";

import { AlumniDetailContactProps } from "@/types/alumni";

export default function AlumniDetailContact({
  email,
  phone,
  linkedin,
  github,
  portfolio,
  resume,
}: AlumniDetailContactProps) {
  const links = [
    {
      label: "LinkedIn",
      value: linkedin,
    },
    {
      label: "GitHub",
      value: github,
    },
    {
      label: "Portfolio",
      value: portfolio,
    },
    {
      label: "Resume",
      value: resume,
    },
  ].filter((item) => item.value);

  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-800
        bg-[#111827]
        p-6
      "
    >
      <h2 className="mb-6 text-xl font-semibold text-blue-400">
        Contact
      </h2>

      <div className="space-y-3 text-sm">
        <p>
          <span className="text-slate-400">
            Email:
          </span>{" "}
          <span className="text-white">
            {email || "N/A"}
          </span>
        </p>

        <p>
          <span className="text-slate-400">
            Phone:
          </span>{" "}
          <span className="text-white">
            {phone || "N/A"}
          </span>
        </p>
      </div>

      {links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.value}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#94a3b8",
                transition: "color 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  "#22c55e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  "#94a3b8";
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}