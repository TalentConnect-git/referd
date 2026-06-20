"use client";

import { useAuth } from "@/context/AuthContext";
import InternshipCard from "./InternshipCard";
import { InternshipContainerProps } from "@/types/internship";

export default function InternshipContainer({
  internships,
  loading,
}: InternshipContainerProps) {
  const { profile } = useAuth();

  const role = profile?.profileType || "student";

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 ml-5 mr-5">
      {internships.map((internship) => (
        <InternshipCard
          key={internship._id}
          title={
            internship.jobTitle?.[0] ||
            "Untitled Internship"
          }
          company={
            internship.receiverProfile?.currentCompany_display ||
            internship.companyName ||
            "Unknown Company"
          }
          location={
            internship.location?.[0] ||
            internship.workLocation?.[0] ||
            "Remote"
          }
          matchScore={internship.matchScore}
          postedBy={
            internship.receiverProfile?.name ||
            internship.candidatePosted?.name ||
            "Anonymous"
          }
          secondaryInfo={
            internship.employmentType?.[0] ||
            "Internship"
          }
          route={`/${role}/jobs/internship/${internship._id}`}
        />
      ))}
    </div>
  );
}