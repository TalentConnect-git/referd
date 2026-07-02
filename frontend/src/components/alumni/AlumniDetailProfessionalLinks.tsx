import {
  Mail,
  Globe,
  FileText,
  Link,
} from "lucide-react";

import { AlumniDetailProfileProps } from "@/types/alumni";

export default function AlumniDetailProfessionalLinks({
  profile,
}: AlumniDetailProfileProps) {
  const links = [
    {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: Mail,
    },
    {
      label: "LinkedIn",
      value: profile.linkedin,
      href: profile.linkedin,
      icon:Globe,
    },
    {
      label: "GitHub",
      value: profile.github,
      href: profile.github,
      icon:Link,
    },
    {
      label: "Resume",
      value: profile.resume,
      href: profile.resume,
      icon: FileText,
    },
  ].filter((item) => item.value);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="mb-5 text-xl font-semibold text-white">
        Professional Links
      </h2>

      {links.length ? (
        <div className="space-y-3">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] p-4 transition hover:border-green-500 hover:bg-white/5"
              >
                <Icon
                  size={20}
                  className="text-green-500"
                />

                <div className="min-w-0">
                  <p className="text-sm text-gray-400">
                    {item.label}
                  </p>

                  <p className="truncate text-white">
                    {item.value}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400">
          No professional links available.
        </p>
      )}
    </div>
  );
}