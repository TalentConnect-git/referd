"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getApplicationById } from "@/services/application.service";
import ApplicationDetailContainer from "@/components/applications/ApplicationDetailContainer";

export default function ApplicationDetailsRoutePage() {
  const params = useParams();
  console.log(params);

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const applicationId = params.applicationid as string;

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  async function fetchApplication() {
    try {
      setLoading(true);

      const response = await getApplicationById(applicationId);

      setApplication(response.data || null);
    } catch (error) {
      console.error(
        "Failed to fetch application details:",
        error
      );
      setApplication(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-6">
        Application not found
      </div>
    );
  }

  return (
    <ApplicationDetailContainer
      application={application}
    />
  );
}