"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAlumniDetails } from "@/services/alumani.services";
import AlumniDetailContainer from "@/components/alumni/AlumniDetailContainer";
import { Loader2 } from "lucide-react";

export default function AlumniDetailPage() {
  const params = useParams();
  
  const alumniId = params.alumniId as string;
  console.log("GUNIK ",alumniId);
  const [alumni, setAlumni] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumni();
  }, [alumniId]);

  async function fetchAlumni() {
    try {
      const response =
        await getAlumniDetails(alumniId);

      console.log("Alumni Details", response);

      setAlumni(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[var(--background)] p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          <p className="text-sm text-[var(--text-muted)]">Loading alumni details...</p>
        </div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[var(--background)] p-6">
        <div className="surface-card max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Alumni Not Found
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            The alumni profile you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 sm:p-6">
      <AlumniDetailContainer profile={alumni} />
    </div>
  );
}