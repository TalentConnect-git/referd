import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardBody from "@/components/dashboard/DashboardBody";
import DashboardAlumini from "@/components/dashboard/DashboardAlumini";
import axiosInstance from "@/lib/axiosInstance";

export default async function DashboardContainer() 
{
    let userName="User";
    let userType="";
    try{
        const response = await axiosInstance.get("/api/onboarding/me");
        let name = response.data.user?.name || "User";
        userName = name.split(" ")[0];
        const response2 = await axiosInstance.get("/api/auth/me");
        const user = response2.data.user;
        userType = user?.userType || "";
    }
    catch(err)
    {
        console.error("Error fetching dashboard header data:", err);
    }
    return(
            <>
            <DashboardHeader userName={userName} /> 
            {/* userData.user.name */}
            <br></br>
            <DashboardStats userType={userType||"student"} />
            <br></br>
            <DashboardBody />
            <br></br>
            <DashboardAlumini />
            </>
        )
}