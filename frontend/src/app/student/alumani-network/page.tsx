"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchAlumniData, type ApiResponse, type AlumniProfile } from "@/services/alumani.services";
import { AlumniCard } from "@/components/alumni/AlumniCard";
import { AlumniPagination } from "@/components/alumni/AlumniPagination";


type AlumniTab = "hiring" | "college" | "company";

const tabs: { key: AlumniTab; label: string }[] = [
  { key: "hiring", label: "Hiring" },
  { key: "college", label: "College" },
  { key: "company", label: "Company" },
];

const LIMIT = 10;

// ---------- Helpers ----------
const flattenCompanyAlumni = (alumniByCompany?: Record<string, AlumniProfile[]>) => {
  if (!alumniByCompany) return [];
  const map = new Map<string, AlumniProfile>();
  Object.values(alumniByCompany).forEach((profiles) => {
    profiles.forEach((p) => map.set(p._id, p));
  });
  return Array.from(map.values());
};

const getAlumniFromResponse = (data: ApiResponse, tab: AlumniTab): AlumniProfile[] => {
  if (tab === "college" || tab === "hiring") {
    return (data as any).data || [];
  }
  // company tab
  const companyData = data as Extract<ApiResponse, { alumniByCompany: any }>;
  return flattenCompanyAlumni(companyData.alumniByCompany);
};

const getTotalCount = (data: ApiResponse, tab: AlumniTab): number => {
  if (tab === "college" || tab === "hiring") {
    return (data as any).meta?.total || 0;
  }
  return (data as any).totalAlumni || 0;
};

// ---------- Page Component ----------
export default function AlumniPage() {
  
  const [activeTab, setActiveTab] = useState<AlumniTab>("hiring");
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Metadata from response
  const [collegesList, setCollegesList] = useState<string[]>([]);   // for fallback
  const [companiesChecked, setCompaniesChecked] = useState<string[]>([]);

  const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchAlumniData(activeTab, page);

      const alumniList = getAlumniFromResponse(data, activeTab);
      const count = getTotalCount(data, activeTab);

      setAlumni(alumniList);
      console.log(alumni);
      setTotalCount(count || alumniList.length);

      // Extract metadata for fallbacks
      if ("colleges" in data) {
        setCollegesList((data as any).colleges || []);
      } else {
        setCollegesList([]);
      }

      if ("companiesChecked" in data) {
        setCompaniesChecked((data as any).companiesChecked || []);
      } else {
        setCompaniesChecked([]);
      }
    } catch (err: any) {
      console.error("Alumni fetch error:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to fetch alumni.",
      );
      setAlumni([]);
      setTotalCount(0);
      setCollegesList([]);
      setCompaniesChecked([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [activeTab, page]);

  const handleTabChange = (tab: AlumniTab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setPage(1);
    setAlumni([]);
    setTotalCount(0);
    setError("");
  };

  const handleMessage = (profile: AlumniProfile) => {
    console.log("Message", profile);
  };

  const handleRequestRefer = (profile: AlumniProfile) => {
    console.log("Request refer", profile);
  };

  // Compute display strings for header
  const collegeDisplayName = collegesList.join(", ");
  const companiesDisplay = companiesChecked.join(", ");

  // Compute card fallbacks (first matching college / company)
  const collegeFallback = collegesList[0] || "";
  const companyFallback = companiesChecked[0] || "";

  return (
    <main className="min-h-screen bg-[#070b12] px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        {/* Header & Tabs */}
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Alumni Network</h1>
            <p className="mt-1 text-sm text-slate-400">
              Connect with alumni from your college, companies, and hiring network.
            </p>
            {(activeTab === "college" || activeTab === "hiring") && collegeDisplayName && (
              <p className="mt-2 text-sm text-green-400">
                Colleges: {collegeDisplayName}
              </p>
            )}
            {(activeTab === "company" || activeTab === "hiring") &&
              companiesDisplay && (
                <p className="mt-2 text-sm text-green-400">
                  Companies checked: {companiesDisplay}
                </p>
              )}
          </div>

          <div className="flex w-full rounded-2xl border border-white/10 bg-[#111821] p-1 sm:w-fit">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex-1 rounded-xl px-5 py-2.5 text-sm font-semibold transition sm:flex-none ${
                    isActive
                      ? "bg-[#2fb344] text-black"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-[#242d3a] bg-[#111821]">
            <div className="flex items-center gap-3 text-slate-300">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading alumni...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && alumni.length === 0 && (
          <div className="rounded-3xl border border-[#242d3a] bg-[#111821] p-10 text-center">
            <h2 className="text-lg font-semibold text-white">No alumni found</h2>
            <p className="mt-2 text-sm text-slate-400">
              Try another tab or check again later.
            </p>
          </div>
        )}

        {/* Alumni Grid */}
        {!loading && !error && alumni.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {alumni.map((profile) => (
                <AlumniCard
                  key={profile._id}
                  profile={profile}
                  collegeFallback={collegeFallback}
                  companyFallback={companyFallback}
                  onMessage={handleMessage}
                  onRequestRefer={handleRequestRefer}
                />
              ))}
            </div>

            <AlumniPagination
              page={page}
              totalPages={totalPages}
              loading={loading}
              onPageChange={setPage}
              currentCount={alumni.length}
              totalCount={totalCount}
            />
          </>
        )}
      </section>
    </main>
  );
}





