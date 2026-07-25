"use client";

import { useAuth } from "@/context/AuthContext";
import InternshipCard from "./InternshipCard";
import { InternshipContainerProps } from "@/types/internship";
import { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";

export default function InternshipContainer({
  internships: initialInternships,
  loading,
  isSavedList = false,
}: InternshipContainerProps & {
  isSavedList?: boolean;
}) {
  const { profile } = useAuth();
  const role = profile?.profileType || "student";
  const [internships, setInternships] = useState(initialInternships || []);
  const [savedInternships, setSavedInternships] = useState<Record<string, boolean>>({});

  // Update internships when prop changes
  useEffect(() => {
    setInternships(initialInternships || []);
  }, [initialInternships]);

  // Handle save toggle from child component
  const handleSaveToggle = (jobId: string, isSaved: boolean) => {
    setSavedInternships((prev) => ({
      ...prev,
      [jobId]: isSaved,
    }));
  };

  // Handle remove from UI
  const handleRemove = (jobId: string) => {
    setInternships((prev) => prev.filter((item) => item._id !== jobId));
  };

  // Check if an internship is saved
  const isInternshipSaved = (internship: any) => {
    if (savedInternships[internship._id] !== undefined) {
      return savedInternships[internship._id];
    }
    return internship?.isSaved || internship?.saved || false;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="mb-5 space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="skeleton rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div className="flex gap-3">
              <div className="skeleton h-10 w-10 rounded-xl" />
              <div className="flex-1">
                <div className="skeleton mb-1.5 h-4 w-40 rounded" />
                <div className="skeleton h-3 w-24 rounded" />
              </div>
            </div>
            <div className="mt-2 flex gap-3">
              <div className="skeleton h-3 w-16 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
            <div className="mt-2 border-t border-[var(--border)] pt-2">
              <div className="flex justify-between">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="flex gap-2">
                  <div className="skeleton h-4 w-4 rounded" />
                  <div className="skeleton h-3 w-12 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!internships || internships.length === 0) {
    return (
      <div className="mb-5">
        <div className="surface-card rounded-2xl p-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-soft)]">
              <Briefcase className="h-6 w-6 text-[var(--text-muted)]" />
            </div>
            <div>
              <h3 className="text-base font-medium text-[var(--text-primary)]">
                {isSavedList ? "No saved internships" : "No internships found"}
              </h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {isSavedList 
                  ? "You haven't saved any internships yet" 
                  : "Check back later for new internship opportunities"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 space-y-3">
      {internships.map((internship) => {
        const isSaved = isInternshipSaved(internship);
        
        // Get company name from companyPosted
        const companyName = 
          internship?.companyPosted?.companyDetails?.companyName ||
          internship?.companyName ||
          "Unknown Company";

        // Get job role from jobRoles or jobTitle
        const jobRole = 
          internship?.jobRoles?.[0] ||
          internship?.jobTitle?.[0] ||
          "Untitled Internship";

        // Get location from hiringLocations or location
        const location = 
          internship?.companyPosted?.hiringPreferences?.hiringLocations?.[0] ||
          internship?.location?.[0] ||
          internship?.workLocation?.[0] ||
          "Remote";

        // Get posted by from companyPosted
        const postedBy = 
          internship?.companyPosted?.employerDetails?.name ||
          internship?.postedByUser ||
          "Anonymous";

        // Get package details
        const packageDetails = internship?.packageDetails || null;

        // Get duration
        const duration = internship?.internshipDuration || null;

        // Get match score
        const matchScore = internship?.matchScore ?? 0;

        // Only show internships based on the list type
        // For saved list: only show saved internships
        // For all list: show all internships
        if (isSavedList && !isSaved) {
          return null;
        }

        return (
          <InternshipCard
            key={internship._id}
            title={jobRole}
            company={companyName}
            location={location}
            matchScore={matchScore}
            postedBy={postedBy}
            secondaryInfo={internship?.employmentType?.[0] || "Internship"}
            route={`/${role}/jobs/internships/${internship._id}`}
            jobId={internship._id}
            jobType="internship"
            isSaved={isSaved}
            onSaveToggle={handleSaveToggle}
            onRemove={handleRemove}
            packageDetails={packageDetails}
            duration={duration}
            isSavedList={isSavedList}
          />
        );
      })}
    </div>
  );
}