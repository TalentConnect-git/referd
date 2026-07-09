"use client";

import { useAuth } from "@/context/AuthContext";
import InternshipCard from "./InternshipCard";
import { InternshipContainerProps } from "@/types/internship";
import { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";

export default function InternshipContainer({
  internships: initialInternships,
  loading,
  isSavedList = false, // NEW: Prop to indicate if this is the saved list view
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
      <div className="space-y-3 ml-5 mr-5 mb-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 animate-pulse"
          >
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-700/50" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-700/50 rounded mb-1.5" />
                <div className="h-3 w-24 bg-gray-700/50 rounded" />
              </div>
            </div>
            <div className="mt-2 flex gap-3">
              <div className="h-3 w-16 bg-gray-700/50 rounded" />
              <div className="h-3 w-20 bg-gray-700/50 rounded" />
              <div className="h-3 w-16 bg-gray-700/50 rounded" />
            </div>
            <div className="mt-2 pt-2 border-t border-[var(--border)]">
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-gray-700/50 rounded" />
                <div className="flex gap-2">
                  <div className="h-4 w-4 bg-gray-700/50 rounded" />
                  <div className="h-3 w-12 bg-gray-700/50 rounded" />
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
      <div className="ml-5 mr-5 mb-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-zinc-800/50 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-zinc-500" />
            </div>
            <div>
              <h3 className="text-base font-medium text-white">
                {isSavedList ? "No saved internships" : "No internships found"}
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
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
    <div className="space-y-3 ml-5 mr-5 mb-5">
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
            route={`/${role}/internships/${internship._id}`}
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