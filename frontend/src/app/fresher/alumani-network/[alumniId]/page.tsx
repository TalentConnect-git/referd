"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAlumniDetails } from "@/services/alumani.services";
import AlumniDetailContainer from "@/components/alumni/AlumniDetailContainer";

export default function AlumniDetailPage() {
  const params = useParams();
  
  const alumniId = params.alumniId as string;
  
  const [alumni, setAlumni] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumni();
  }, [alumniId]);

  async function fetchAlumni() {
    try {
      const response =
        await getAlumniDetails(alumniId);

      

      setAlumni(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading...
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="p-6 text-white">
        Alumni not found
      </div>
    );
  }

  return (
    <div className="p-6">
    <AlumniDetailContainer profile={alumni}/>
  </div>
  );
}




