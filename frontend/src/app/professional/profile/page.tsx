"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  // Github,
  // Linkedin,
  Globe,
  Loader2,
} from "lucide-react";

type ProfileData = {
  profileImage?: string;
  backgroundImage?: string;
  resume?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  about?: string;
  profileType?: string;
  college?: string;
  degree?: string;
  specialization?: string;
  yearOfGraduation?: string;
  cgpa?: string;
  currentCompany?: string;
  totalYearsOfExperience?: string;
  noticePeriod?: string;
  skills?: string[] | string;
  toolsAndPlatforms?: string[] | string;
  languagesKnown?: string[] | string;
  domainKnowledge?: string[] | string;
  jobRoles?: string[] | string;
  locations?: string[] | string;
  industry?: string[] | string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  experiences?: Experience[];
  achievements?: Achievement[];
};

type Experience = {
  _id?: string;
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  isCurrent?: boolean;
};

type Achievement = {
  _id?: string;
  title?: string;
  event?: string;
  date?: string;
};

function parseArrayField(field?: string[] | string): string[] {
  if (Array.isArray(field)) return field;
  if (typeof field === "string" && field.length > 0) {
    return field.split(",").map((item) => item.trim());
  }
  return [];
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");


  
function Github() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.85 10.91.57.1.78-.25.78-.55v-2.1c-3.19.7-3.87-1.36-3.87-1.36-.52-1.31-1.28-1.66-1.28-1.66-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.27.73-1.56-2.55-.29-5.23-1.28-5.23-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a10.9 10.9 0 012.9-.39c.98 0 1.97.13 2.9.39 2.21-1.5 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.44-2.69 5.42-5.25 5.7.42.37.79 1.09.79 2.2v3.26c0 .31.2.66.79.55A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function Linkedin() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM.5 8h4V24h-4V8zm7 0h3.83v2.18h.05c.53-1.01 1.84-2.08 3.79-2.08 4.05 0 4.8 2.66 4.8 6.12V24h-4v-6.86c0-1.64-.03-3.74-2.28-3.74-2.29 0-2.64 1.79-2.64 3.63V24h-4V8z" />
    </svg>
  );
}



  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        setLoading(true);
        setError("");

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const token = localStorage.getItem("token");

        const response = await axios.get(`${backendUrl}/api/onboarding/me`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileData(response.data?.data || response.data);
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        setError(
          err.response?.data?.details ||
            err.response?.data?.message ||
            "Failed to load profile data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-white">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-[var(--primary)]" />
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-white">
        No profile data found
      </div>
    );
  }

  const fullName = profileData.fullName || profileData.name || "N/A";
  const skills = parseArrayField(profileData.skills);
  const tools = parseArrayField(profileData.toolsAndPlatforms);
  const domains = parseArrayField(profileData.domainKnowledge);
  const languages = parseArrayField(profileData.languagesKnown);
  const jobRoles = parseArrayField(profileData.jobRoles);
  const locations = parseArrayField(profileData.locations);
  const industries = parseArrayField(profileData.industry);

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--text-primary)]">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="glass-card overflow-hidden rounded-[var(--radius-xl)]">
          <div
            className="h-44 bg-[var(--background-soft)] bg-cover bg-center"
            style={{
              backgroundImage: profileData.backgroundImage
                ? `url(${profileData.backgroundImage})`
                : "none",
            }}
          />

          <div className="relative px-6 pb-6">
            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--background)] bg-[var(--card)]">
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-[var(--primary)]" />
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">{fullName}</h1>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {profileData.degree || "N/A"} at{" "}
                  {profileData.college || "N/A"}
                </p>
              </div>

              <div className="flex gap-3">
                <SocialIcon href={profileData.linkedin} icon={<Linkedin />} />
                <SocialIcon href={profileData.github} icon={<Github />} />
                <SocialIcon href={profileData.portfolio} icon={<Globe />} />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ProfileCard title="About">
              <p className="leading-7">
                {profileData.about || "No information provided."}
              </p>
            </ProfileCard>

            <ProfileCard title="Contact Information">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem icon={<Mail />} label="Email" value={profileData.email} />
                <InfoItem icon={<Phone />} label="Phone" value={profileData.phone} />
              </div>
            </ProfileCard>

            <ProfileCard title="Academic Background">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={<GraduationCap />}
                  label="College"
                  value={profileData.college}
                />
                <InfoItem
                  icon={<GraduationCap />}
                  label="Degree"
                  value={profileData.degree}
                />
                <InfoItem
                  icon={<GraduationCap />}
                  label="Specialization"
                  value={profileData.specialization}
                />
                <InfoItem
                  icon={<GraduationCap />}
                  label="Graduation Year"
                  value={profileData.yearOfGraduation}
                />
                <InfoItem
                  icon={<GraduationCap />}
                  label="CGPA / Percentage"
                  value={profileData.cgpa}
                />
              </div>
            </ProfileCard>

            <ProfileCard title="Work Experience">
              {profileData.experiences && profileData.experiences.length > 0 ? (
                <div className="space-y-4">
                  {profileData.experiences.map((exp, index) => (
                    <div
                      key={exp._id || index}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-4"
                    >
                      <h3 className="font-semibold text-white">
                        {exp.role || "N/A"} at {exp.company || "N/A"}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {exp.startDate || "N/A"} -{" "}
                        {exp.isCurrent ? "Present" : exp.endDate || "Present"}
                      </p>
                      <p className="mt-3 text-sm leading-6">
                        {exp.description || "No description provided."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyText text="No work experience added." />
              )}
            </ProfileCard>

            <ProfileCard title="Achievements">
              {profileData.achievements && profileData.achievements.length > 0 ? (
                <div className="space-y-4">
                  {profileData.achievements.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-4"
                    >
                      <h3 className="font-semibold text-white">
                        {item.title || "N/A"}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {item.event || "N/A"} - {item.date || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyText text="No achievements added." />
              )}
            </ProfileCard>
          </div>

          <div className="space-y-6">
            <ProfileCard title="Career Details">
              <InfoItem
                icon={<Briefcase />}
                label="Current Company"
                value={profileData.currentCompany}
              />
              <InfoItem
                icon={<Briefcase />}
                label="Total Experience"
                value={profileData.totalYearsOfExperience}
              />
              <InfoItem
                icon={<Briefcase />}
                label="Notice Period"
                value={
                  profileData.noticePeriod
                    ? `${profileData.noticePeriod} days`
                    : undefined
                }
              />
            </ProfileCard>

            <ProfileCard title="Skills">
              <TagList items={skills} />
            </ProfileCard>

            <ProfileCard title="Tools & Platforms">
              <TagList items={tools} />
            </ProfileCard>

            <ProfileCard title="Domain Knowledge">
              <TagList items={domains} />
            </ProfileCard>

            <ProfileCard title="Interested Industries">
              <TagList items={industries} />
            </ProfileCard>

            <ProfileCard title="Job Roles">
              <TagList items={jobRoles} />
            </ProfileCard>

            <ProfileCard title="Preferred Locations">
              <TagList items={locations} />
            </ProfileCard>

            <ProfileCard title="Known Languages">
              <TagList items={languages} />
            </ProfileCard>

            {profileData.resume && (
              <a
                href={profileData.resume}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl bg-[var(--primary)] px-5 py-3 text-center font-semibold text-black transition hover:bg-[var(--primary-dark)]"
              >
                View Resume
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfileCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-card rounded-[var(--radius-xl)] p-6">
      <h2 className="mb-5 text-xl font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-4">
      <div className="mt-1 text-[var(--primary)] [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </div>
      <div>
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
        <p className="mt-1 text-sm font-medium text-white">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (!items.length) return <EmptyText text="N/A" />;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-[var(--border-strong)] bg-[var(--primary-soft)] px-3 py-1 text-sm text-white"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return <p className="text-sm text-[var(--text-muted)]">{text}</p>;
}

function SocialIcon({
  href,
  icon,
}: {
  href?: string;
  icon: React.ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-white transition hover:border-[var(--primary)] hover:text-[var(--primary)] [&_svg]:h-5 [&_svg]:w-5"
    >
      {icon}
    </a>
  );
}