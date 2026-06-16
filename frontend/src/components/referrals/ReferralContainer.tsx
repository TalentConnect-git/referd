"use client";

import { useEffect, useState } from "react";
import { getMyReferrals } from "@/services/referral.service";
import ReferralCard from "./ReferralCard";
import { ReferralJob } from "@/types/referral";
import ReferralHeader from "./ReferralHeader";
import ReferralPagination from "./ReferralPagination";
import ResumeReferral from "./ResumeReferral";
import ReferralDetails from "./ReferralDetails";
import { deleteReferral ,pauseReferral,reactivateReferral} from "@/services/referral.service";
import toast from "react-hot-toast";

export default function ReferralContainer() {
  const [referrals, setReferrals] = useState<ReferralJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
    });
   const [selectedReferral, setSelectedReferral] =useState<ReferralJob | null>(null);
   const [showResumeModal, setShowResumeModal] =useState(false);
   const [resumeReferralJob, setResumeReferralJob] =useState<ReferralJob | null>(null);


    const dummyReferrals: ReferralJob[] = [
  {
    _id: "6a281805e40a48a1d482cb8c",
    jobTitle: ["Software Engineer"],
    location: ["Bengaluru"],
    approvalStatus: "Approved",
    jobStatus: "Active",
    inactive: false,

    description: "Backend development role",

    packageDetails: {
      currency: "INR",
      totalCTC: 18,
    },

    metrics: {
      totalApplicationsReceived: 18,
      totalReferredToCompany: 6,
      totalInterviewScheduled: 12,
      totalAcceptedByCompany: 3,
      responseRate: 70,
      referralSuccessRate: 25,
    },
  },

  {
    _id: "2",
    jobTitle: ["Product Manager"],
    location: ["Remote"],
    approvalStatus: "Pending",
    jobStatus: "Pending",
    inactive: false,

    description: "PM role",

    packageDetails: {
      currency: "INR",
      totalCTC: 24,
    },

    metrics: {
      totalApplicationsReceived: 14,
      totalReferredToCompany: 4,
      totalInterviewScheduled: 10,
      totalAcceptedByCompany: 2,
      responseRate: 60,
      referralSuccessRate: 20,
    },
  },

  {
    _id: "3",
    jobTitle: ["Backend Engineer"],
    location: ["Hyderabad"],
    approvalStatus: "Approved",
    jobStatus: "Closed",
    inactive: true,

    description: "Java + Spring Boot",

    packageDetails: {
      currency: "INR",
      totalCTC: 15,
    },

    metrics: {
      totalApplicationsReceived: 25,
      totalReferredToCompany: 8,
      totalInterviewScheduled: 5,
      totalAcceptedByCompany: 1,
      responseRate: 40,
      referralSuccessRate: 10,
    },
  },
];

  const fetchReferrals = async () => {
    try {
      setLoading(true);

      const response = await getMyReferrals(page, 10);

    setReferrals(response.data || []);

      setMeta({
        totalPages: response.meta?.totalPages || 1,
        hasNext: response.meta?.hasNext || false,
        hasPrev: response.meta?.hasPrev || false,
      });
    } catch (error) {
      console.error("Error fetching referrals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [page]);

const handleDelete = async (jobId: string) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this referral?"
      );
  
      if (!confirmed) return;
  
      let result = await deleteReferral(jobId);
      if(result?.success)
      {
        toast.success("Referral deleted successfully");
      }
      fetchReferrals();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete referral");
    }
  };
  const handlePause = async (referral: ReferralJob) => {
  try {
    if (!referral.inactive) {
      await pauseReferral(referral._id);
      toast.success("Referral paused successfully");
    } else {
      setResumeReferralJob(referral);
      setShowResumeModal(true);
    }

    fetchReferrals();
  } catch (error) {
    console.error(error);
    toast.error("Operation failed");
  }
};
const handleResume = async (
  startDate: string,
  endDate: string
) => {
  try {
    if (!resumeReferralJob) return;

    if (!startDate || !endDate) {
      toast.error(
        "Please select start and end date"
      );
      return;
    }

    const result = await reactivateReferral(
      resumeReferralJob._id,
      startDate,
      endDate
    );

    if (result) {
      toast.success(
        "Referral reactivated successfully"
      );
    }

    setShowResumeModal(false);
    setResumeReferralJob(null);

    fetchReferrals();
  } catch (error) {
    console.error(error);
    toast.error(
      "Failed to reactivate referral"
    );
  }
};

//   if (!loading && referrals.length === 0) {
//     return <div>No referrals posted yet</div>;
//   }

  return (
  <div className="min-h-screen flex flex-col">
    <ReferralHeader />

    {selectedReferral && (
    <ReferralDetails
      referral={selectedReferral} onClose={() => setSelectedReferral(null)}/>
  )}

  {showResumeModal && resumeReferralJob && (
  <ResumeReferral
    onClose={() => {
      setShowResumeModal(false);
      setResumeReferralJob(null);
    }}
    onSubmit={handleResume}
  />
)}

    <div className="flex-1 flex flex-col gap-6 mt-5">
      {dummyReferrals.map((referral) => (
        <ReferralCard
          key={referral._id}
          referral={referral}
          onViewDetails={() => setSelectedReferral(referral)}
          handleDelete={() => handleDelete(referral._id)}
          onPause={() => handlePause(referral)}
        />
      ))}

      {/* {!loading && referrals.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          No referrals posted yet
        </div>
      )} */}


    </div>

    {referrals.length > 0 && (
      <ReferralPagination
        page={page}
        totalPages={meta.totalPages}
        hasNext={meta.hasNext}
        hasPrev={meta.hasPrev}
        onPrevious={() => setPage((prev) => prev - 1)}
        onNext={() => setPage((prev) => prev + 1)}
      />
    )}
  </div>
);
}




