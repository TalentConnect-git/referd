"use client";
import  ProfessionalApplications  from "./ProfessionalApplications";
import StudentApplications from "./StudentApplications";
import { useAuth } from "@/context/AuthContext";
import {useMemo} from 'react';
export default function ApplicationContainer()
{
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
    <>
      {userType === "professional" ? (
        <ProfessionalApplications />
      ) : (
        <StudentApplications />
      )}
    </>

  );
}