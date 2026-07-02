"use client";

import { useEffect, useState } from "react";
import { getInterviews } from "@/services/navbar.service";
import { Interview } from "@/types/navbar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function InterviewCall() {

    const [interviews,setInterviews] = useState<Interview[]>([]);
    const [loading,setLoading]=useState(true);
    const router = useRouter();
    const { profile, user } = useAuth();
    const userType =
        profile?.profileType ||
        user?.userType ||
        "student";

// const dummyInterviews = [
//   {
//     _id: "6a2918309442caf1f9a33611",
//     jobId: {
//       _id: "job1",
//       jobTitle: "Frontend Developer",
//       jobType: "Off-campus",
//     },
//     applicantAuthId: "user1",
//     applicantType: "student",
//     date: "2026-07-02",
//     time: "10:00 AM",
//     meetLink: "https://meet.google.com/abc-defg-hij",
//     message: "Please join 10 minutes early.",
//     status: "Scheduled",
//     companySnapshot: {
//       companyName: "Google",
//     },
//     createdAt: "2026-07-01T10:00:00Z",
//   },
//   {
//     _id: "2",
//     jobId: {
//       _id: "job2",
//       jobTitle: "Backend Developer",
//       jobType: "Referral",
//     },
//     applicantAuthId: "user1",
//     applicantType: "student",
//     date: "2026-07-03",
//     time: "2:30 PM",
//     meetLink: "https://meet.google.com/backend",
//     message: "Technical Round",
//     status: "Scheduled",
//     companySnapshot: {
//       companyName: "Microsoft",
//     },
//     createdAt: "2026-07-01T10:00:00Z",
//   },
//   {
//     _id: "3",
//     jobId: {
//       _id: "job3",
//       jobTitle: "SDE Intern",
//       jobType: "Internship",
//     },
//     applicantAuthId: "user1",
//     applicantType: "student",
//     date: "2026-07-05",
//     time: "11:30 AM",
//     meetLink: "https://meet.google.com/intern",
//     message: "HR Round",
//     status: "Completed",
//     companySnapshot: {
//       companyName: "Amazon",
//     },
//     createdAt: "2026-07-01T10:00:00Z",
//   },
//   {
//     _id: "4",
//     jobId: {
//       _id: "job4",
//       jobTitle: "Software Engineer",
//       jobType: "Referral",
//     },
//     applicantAuthId: "user1",
//     applicantType: "student",
//     date: "2026-07-07",
//     time: "9:00 AM",
//     meetLink: "https://meet.google.com/meta",
//     message: "Manager Round",
//     status: "Scheduled",
//     companySnapshot: {
//       companyName: "Meta",
//     },
//     createdAt: "2026-07-01T10:00:00Z",
//   },
// ];

    useEffect(()=>{
        const fetchInterviews = async()=>{
            try{
                const res = await getInterviews();
                setInterviews(res.data);
            }catch(err){
                console.log(err);
            }finally{
                setLoading(false);
            }
        }
        fetchInterviews();
    },[])



    if(loading)
        return <div className="p-4">Loading...</div>;

    if(interviews.length===0)
        return <div className="p-4">No Interviews Scheduled</div>;

    return(

        <div>

            {interviews.map(interview=>(

                <div
                    key={interview._id}
                    className="border-b border-[var(--border)] p-4"
                    onClick={() =>router.push(`/${userType}/applications/${interview._id}`)}
                >
                    <h4 className="font-semibold">
                        {interview.jobId.jobTitle}
                    </h4>
                    <p className="text-sm opacity-70">
                        {interview.companySnapshot.companyName}
                    </p>
                    <p className="text-sm mt-2">
                        📅 {interview.date}
                    </p>
                    <p className="text-sm">
                        🕒 {interview.time}
                    </p>
                    <p
                        className={`text-xs mt-2 ${
                            interview.status==="Scheduled"
                            ?"text-green-400"
                            :"text-red-400"
                        }`}
                    >
                        {interview.status}
                    </p>
                </div>

            ))}

        </div>

    )

}