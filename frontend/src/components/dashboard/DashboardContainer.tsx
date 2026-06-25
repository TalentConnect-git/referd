"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardBody from "@/components/dashboard/DashboardBody";
import DashboardAlumini from "@/components/dashboard/DashboardAlumini";
// import FloatingMessage from "@/components/chats/FloatingMessage";
import { useAuth } from "@/context/AuthContext";

export default function DashboardContainer() {
  const { profile, role } = useAuth();
  const userName = profile?.fullName || profile?.name || "User";
  const userRole = role || profile?.profileType || "student";

  return (
    <>
      <DashboardHeader userName={userName} userType={userRole} />

      <br />

      <DashboardStats userType={userRole} />

      <br />

      <DashboardBody />

      <br />
      <DashboardAlumini userType={userRole} />
      <br />

    
      {/* <FloatingMessage /> */}
     {/* <div className=" bottom-0 right-6 z-[9999] flex justify-end">
      <FloatingMessage />
      </div> */}


    </>
  );
}
