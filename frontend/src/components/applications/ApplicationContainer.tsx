"use client";
import ProfessionalApplications from "./ProfessionalApplications";
import StudentApplications from "./StudentApplications";
import { useAuth } from "@/context/AuthContext";
import { useMemo } from 'react';

export default function ApplicationContainer() {
  const { profile } = useAuth();
  const role = profile?.profileType;
  
  const userType = useMemo(() => {
    return (role || profile?.profileType) as
      | "student"
      | "fresher"
      | "professional"
      | undefined;
  }, [role, profile?.profileType]);

  return (
    <div className="min-h-screen bg-[var(--background)] py-4 sm:py-6">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        {userType === "professional" ? (
          <ProfessionalApplications />
        ) : (
          <StudentApplications />
        )}
      </div>
    </div>
  );
}