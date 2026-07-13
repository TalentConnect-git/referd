"use client";
import Link from "next/link";
import ReferralCard from "@/components/ui/ReferralCard";
import { RevealItem } from "@/components/ui/RevealSection";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// const referralJobs = [
//   {
//     companyLogo: "G",
//     title: "Software Engineer",
//     company: "Google",
//     location: "Bengaluru",
//     match: "94%",
//     postedByInitials: "AS",
//     postedByName: "Ananya Sharma",
//     college: "VIPS '21",
//     salary: "₹28–42 LPA",
//   },
//   {
//     companyLogo: "S",
//     title: "Product Manager",
//     company: "Stripe",
//     location: "Remote",
//     match: "88%",
//     postedByInitials: "RV",
//     postedByName: "Rohit Verma",
//     college: "IIT Delhi '19",
//     salary: "₹45–70 LPA",
//   },
//   {
//     companyLogo: "R",
//     title: "Backend Engineer",
//     company: "Razorpay",
//     location: "Bengaluru",
//     match: "91%",
//     postedByInitials: "PI",
//     postedByName: "Priya Iyer",
//     college: "VIPS '22",
//     salary: "₹22–35 LPA",
//   },
//   {
//     companyLogo: "L",
//     title: "Design Engineer",
//     company: "Linear",
//     location: "Remote",
//     match: "86%",
//     postedByInitials: "KS",
//     postedByName: "Kabir Singh",
//     college: "NID '20",
//     salary: "₹18–28 LPA",
//   },
//   {
//     companyLogo: "M",
//     title: "Data Scientist",
//     company: "Microsoft",
//     location: "Hyderabad",
//     match: "82%",
//     postedByInitials: "MR",
//     postedByName: "Megha Rao",
//     college: "BITS Pilani '18",
//     salary: "₹30–48 LPA",
//   },
//   {
//     companyLogo: "N",
//     title: "Frontend Engineer",
//     company: "Notion",
//     location: "Remote",
//     match: "90%",
//     postedByInitials: "VP",
//     postedByName: "Vikram Patel",
//     college: "VIPS '20",
//     salary: "₹25–40 LPA",
//   },
// ];

export default function ReferralJobs() {
  const [referralJobs, setReferralJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { role, isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    fetchReferralJobs();
  }, []);

  async function fetchReferralJobs() {
    try {
      const response = await axiosInstance.get(
        "/api/student-dashboard/referral-jobs",
      );

      const jobs = response.data?.data?.slice(0, 6) || [];
      setReferralJobs(jobs);
    } catch (err) {
      console.error("Failed to fetch referral jobs", err);
      setReferralJobs([]);
    } finally {
      setLoading(false);
    }
  }

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <section className="px-6 py-24">
        <p className="text-center text-gray-400"></p>
      </section>
    );
  }

  const handleGetStarted = () => {
    if (loading) return; // prevent action while auth state is being determined

    if (isAuthenticated && role) {
      if (role === "professional") {
        router.push(`/${role}/jobs/referral-jobs`);
      } else {
        router.push(`/${role}/jobs`);
      }
    } else {
      router.push(`/login`);
    }
  };

  return (
    <section
      id="referrals"
      className="bg-[var(--background)] px-6 py-24 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-7 font-mono text-[14px] font-semibold uppercase tracking-[0.35em] text-[var(--primary)]">
          Referral Jobs
        </p>

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <h2 className="max-w-3xl text-[34px] font-bold leading-tight tracking-[-0.04em] text-white md:text-[42px]">
              Referral opportunities
              <br />
              from real employees.
            </h2>

            <p className="mt-6 max-w-5xl text-[18px] leading-8 text-[var(--text-primary)]">
              Every role is posted by someone who can actually pass your resume
              to the hiring manager.
            </p>
          </div>

          <button
            onClick={handleGetStarted}
            className="flex items-center gap-4 text-[16px] font-mono text-[var(--text-primary)] transition hover:text-white"
          >
            See all referrals
            <span className="text-[26px]">→</span>
          </button>
        </div>

        {/* <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {referralJobs.map((job:any) => (
            <ReferralCard key={`${job._id}`} {...job} />
          ))}
        </div> */}

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {referralJobs.map((job, index) => (
            <RevealItem key={job._id} delay={index * 0.1}>
              <ReferralCard
                companyLogo={
                  job.candidatePosted?.currentCompany?.[0]?.toUpperCase() || "C"
                }
                title={job.jobTitle?.[0] || "Referral Opportunity"}
                company={
                  job.candidatePosted?.currentCompany || "Unknown Company"
                }
                location={
                  job.receiverProfile?.locations?.[0] ||
                  job.location?.[0] ||
                  "Remote"
                }
                match={`${job.matchScore}%`}
                postedByInitials={getInitials(job.candidatePosted?.name)}
                postedByName={
                  job.receiverProfile?.name ||
                  job.candidatePosted?.name ||
                  "Anonymous"
                }
                college={job.receiverProfile?.educations?.[0]?.college || "-"}
                salary={job.packageDetails.totalCTC ?? "-"}
              />
            </RevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}
