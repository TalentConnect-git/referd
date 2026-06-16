"use client";
import { useState,useEffect } from "react";
import ApplicationTabs from "./ApplicationsTabs";
import ApplicationTable from "./ApplicationTable";
import ApplicationStats from "./ApplicationStats";
import { getCandidateApplications } from "@/services/application.service";
import {ApplicationType} from '@/types/applications';

export default function StudentApplications() {

    const [activeTab, setActiveTab] = useState<ApplicationType>("Referral");
    //const [applications, setApplications] = useState<Application[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    const [limit] = useState(10);
   useEffect(() => {
  const fetchApplications = async () => {
    try {
      const response =
        await getCandidateApplications(
          activeTab,
          page,
          limit
        );

      setApplications(response.data || []);
      setMeta(response.meta || null);
    } catch (error) {
      console.error(
        "Failed to fetch applications",
        error
      );
    }
  };

  fetchApplications();
}, [activeTab, page, limit]);


    
    return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col">
      <div className="pt-6 mt-5 ml-5 mb-5">
        <ApplicationTabs
        activeTab={activeTab}
        onChange={setActiveTab}/>
      </div>

      <ApplicationTable
        applicationType={activeTab}
        applications={applications}
        page={page}
        meta={meta}
        />

      <ApplicationStats
        applicationType={activeTab}
        applications={applications}
        />
        
    </div>

  );

}