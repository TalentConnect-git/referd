import axiosInstance from "@/lib/axios";
interface DashboardHeaderProps {
    userName: string;
}

export default async function DashBoardHeader({ userName }: DashboardHeaderProps)
{
   
    return(
        <div className="mt-8 ml-5">
        <div className="mb-8">
        <p className="text-gray-500 text-sm">Welcome Back!</p>
        <h1 className="text-2xl font-bold mt-2">{userName}, here's what moved in your network.</h1>
        </div>
        </div>
    )
}