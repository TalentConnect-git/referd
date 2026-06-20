"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

import InternshipDetailPage from "@/components/internships/InternshipDetailPage";

export default function InternshipDetails() {
  const params = useParams();

  const [internship, setInternship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchInternship(params.id as string);
    }
  }, [params?.id]);

  async function fetchInternship(id: string) {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `/api/student-dashboard/job-details/${id}`
      );

      setInternship(response.data?.data || null);
    } catch (error) {
      console.error(
        "Failed to fetch internship details",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!internship) {
    return <div>Internship not found</div>;
  }

  return (
    <InternshipDetailPage
      internship={internship}
    />
  );
}