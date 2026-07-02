"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";
import { getApplicationDetails } from "@/services/application.service";
import ApplicationTimeline from "@/components/applications/ApplicationTimeline";

export default function ApplicationDetailsPage() {

  const { applicationid } = useParams();
  console.log("Params ",useParams());
  const router = useRouter();

  const [application, setApplication] =useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res =
          await getApplicationDetails(
            applicationid as string
          );

        setApplication(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDetails();
  }, [applicationid]);

  if (!application) {
  return <div>Loading...</div>;
}
  return (
  <div className="max-w-5xl mx-auto px-6 py-8">

    {/* Back Button */}
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
    >
      <ArrowLeft size={18} />
      Back
    </button>

    {/* Header Card */}
    <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6 mb-8">

      <div className="flex items-start justify-between">

        <div>
          <h1 className="text-2xl font-bold text-white">
            {application?.job?.jobTitle?.[0] || "Application"}
          </h1>

          <p className="text-slate-400 mt-1">
            {application?.job?.companyName || "Company"}
          </p>

          <p className="text-sm text-slate-500 mt-3">
            Applied on{" "}
            {new Date(
              application.createdAt
            ).toLocaleDateString()}
          </p>

          <p className="text-sm text-slate-500 mt-2">
            Referrer:{" "}
            {application?.job?.candidatePosted?.name ||
              "N/A"}
          </p>
        </div>

        <div className="px-4 py-2 rounded-full bg-green-500/10 text-green-400 font-medium">
          {application.currentStatus}
        </div>

      </div>
    </div>

    {/* Timeline Section */}
    <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6">

      <h2 className="text-lg font-semibold text-white mb-6">
        Progress Timeline
      </h2>

      <ApplicationTimeline
        currentStatus={application.currentStatus}
      />

    </div>

  </div>

  );
}






