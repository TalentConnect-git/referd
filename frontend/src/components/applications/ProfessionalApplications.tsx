"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { RefreshCw } from "lucide-react";

import ProfessionalApplicationTabs from "./ProfessionalApplicationTabs";
import ApplicationTable from "./ApplicationTable";
import ApplicationByMe from "./ApplicationByMe";
import ApplicationStats from "./ApplicationStats";
import ApplicationsToMeTable from "./ApplicationalsToMeTable";

import {
  getProfessionalApplications,
  getProfessionalReceivedApplications,
  getReferredByMe,
} from "@/services/application.service";

import type { ProfessionalApplicationType } from "@/types/applications";

const DEFAULT_TAB: ProfessionalApplicationType = "Requests Received";

const VALID_TABS: ProfessionalApplicationType[] = [
  "Requests Received",
  "Applications By Me",
  "Referred By Me",
];

function isValidTab(
  value: string | null,
): value is ProfessionalApplicationType {
  return Boolean(
    value &&
      VALID_TABS.includes(value as ProfessionalApplicationType),
  );
}

export default function ProfessionalApplications() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlTab = searchParams.get("tab");

  const initialTab: ProfessionalApplicationType = isValidTab(urlTab)
    ? urlTab
    : DEFAULT_TAB;

  const [activeTab, setActiveTab] =
    useState<ProfessionalApplicationType>(initialTab);

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  const limit = 10;

  /**
   * Keep local state synchronized when the user navigates
   * with browser back/forward buttons.
   */
  useEffect(() => {
    const nextTab = isValidTab(urlTab) ? urlTab : DEFAULT_TAB;

    setActiveTab((currentTab) => {
      if (currentTab === nextTab) {
        return currentTab;
      }

      return nextTab;
    });

    setPage(1);
  }, [urlTab]);

  const fetchApplications = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);
        setError(null);

        let response;

        if (activeTab === "Requests Received") {
          response = await getProfessionalReceivedApplications(
            page,
            limit,
          );
        } else if (activeTab === "Applications By Me") {
          response = await getProfessionalApplications(page, limit);
        } else {
          response = await getReferredByMe(page, limit);
        }

        if (signal?.aborted) return;

        setApplications(
          Array.isArray(response?.data) ? response.data : [],
        );

        setMeta(response?.meta || null);
      } catch (fetchError: any) {
        if (signal?.aborted) return;

        console.error(
          "Failed to fetch professional applications:",
          fetchError,
        );

        setError(
          fetchError?.response?.data?.message ||
            fetchError?.message ||
            "Failed to load applications",
        );

        setApplications([]);
        setMeta(null);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [activeTab, page],
  );

  /**
   * Fetch only when activeTab or page changes.
   */
  useEffect(() => {
    const controller = new AbortController();

    void fetchApplications(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchApplications]);

  const handleTabChange = useCallback(
    (tab: ProfessionalApplicationType) => {
      // Do nothing when the same tab is clicked.
      if (tab === activeTab) {
        return;
      }

      setActiveTab(tab);
      setPage(1);
      setError(null);

      const currentUrlTab = searchParams.get("tab");

      // Prevent repeated router navigation.
      if (currentUrlTab === tab) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [
      activeTab,
      pathname,
      router,
      searchParams,
    ],
  );

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage < 1) return;

    setPage((currentPage) => {
      if (currentPage === newPage) {
        return currentPage;
      }

      return newPage;
    });
  }, []);

  const handleStatusUpdate = useCallback(() => {
    void fetchApplications();
  }, [fetchApplications]);

  const handleRetry = useCallback(() => {
    void fetchApplications();
  }, [fetchApplications]);

  const renderStats = useMemo(() => {
    if (
      loading ||
      error ||
      applications.length === 0
    ) {
      return null;
    }

    return (
      <div className="mx-5 mt-3">
        <ApplicationStats
          applicationType="Referral"
          applications={applications}
        />
      </div>
    );
  }, [applications, error, loading]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="mx-5 mb-4 mt-4">
          <div className="rounded-2xl border border-slate-800 p-8 text-center">
            <div className="flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-green-500/30 border-t-green-500" />

              <span className="ml-2 text-xs text-gray-400">
                Loading applications...
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="mx-5 mb-4 mt-4">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <p className="text-sm text-red-400">
              Error: {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/30"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === "Requests Received") {
      return (
        <ApplicationsToMeTable
          applications={applications}
          page={page}
          meta={meta}
          onPageChange={handlePageChange}
        />
      );
    }

    if (activeTab === "Applications By Me") {
      return (
        <ApplicationByMe
          applications={applications}
          page={page}
          meta={meta}
          onPageChange={handlePageChange}
          onStatusUpdate={handleStatusUpdate}
        />
      );
    }

    if (activeTab === "Referred By Me") {
      return (
        <ApplicationTable
          applicationType="Referral"
          applications={applications}
          page={page}
          meta={meta}
          onPageChange={handlePageChange}
          onStatusUpdate={handleStatusUpdate}
        />
      );
    }

    return (
      <div className="mx-5 mb-4 mt-4">
        <div className="rounded-2xl border border-slate-800 p-8 text-center">
          <p className="text-sm text-gray-400">
            No applications found
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col">
      {renderStats}

      <div className="mx-5 mt-3">
        <ProfessionalApplicationTabs
          activeTab={activeTab}
          onChange={handleTabChange}
        />
      </div>

      {renderContent()}
    </div>
  );
}