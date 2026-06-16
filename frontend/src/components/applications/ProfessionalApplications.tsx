"use client";

import { useState, useEffect } from "react";
import ProfessionalApplicationTabs from "./ProfessionalApplicationTabs";
import ApplicationTable from "./ApplicationTable";
import ApplicationStats from "./ApplicationStats";
import ApplicationsToMeTable from './ApplicationalsToMeTable'
import {getProfessionalApplications,getProfessionalReceivedApplications,} from "@/services/application.service";
import { ProfessionalApplicationType } from "@/types/applications";

export default function ProfessionalApplications() {
  const [activeTab, setActiveTab] =
    useState<ProfessionalApplicationType>(
      "Applications To Me"
    );

  const [applications, setApplications] =
    useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  const [limit] = useState(10);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        let response;

        if (activeTab === "Applications To Me") {
          response =
            await getProfessionalReceivedApplications(
              page,
              limit
            );
        } else {
          response =
            await getProfessionalApplications(
              page,
              limit
            );
        }

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
        <ProfessionalApplicationTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>


      {activeTab === "Applications To Me" ? (
    <ApplicationsToMeTable
    applications={applications}
    page={page}
    meta={meta}
  />
) : (
  <ApplicationTable
    applicationType={"Referral"}
    applications={applications}
    page={page}
    meta={meta}
  />
)}

      <ApplicationStats
        applicationType={"Referral"}
        applications={applications}
      />
    </div>
  );
}




