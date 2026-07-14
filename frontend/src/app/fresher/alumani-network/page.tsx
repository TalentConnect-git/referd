"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  fetchAlumniData,
  type ApiResponse,
  type AlumniProfile,
} from "@/services/alumani.services";

import { AlumniCard } from "@/components/alumni/AlumniCard";
import { AlumniPagination } from "@/components/alumni/AlumniPagination";

type AlumniTab = "hiring" | "college" | "company";

type CompanyCheckedObject = {
  key?: string | null;
  canonicalId?: string | null;
  companyName?: string | null;
  displayName?: string | null;
};

type AlumniApiResponse = ApiResponse & {
  data?: AlumniProfile[];
  colleges?: unknown;
  companiesChecked?: unknown;
  alumniByCompany?: Record<string, AlumniProfile[]>;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  totalAlumni?: number;
  message?: string;
};

const tabs: Array<{
  key: AlumniTab;
  label: string;
}> = [
  {
    key: "hiring",
    label: "Hiring",
  },
  {
    key: "college",
    label: "College",
  },
  {
    key: "company",
    label: "Company",
  },
];

const LIMIT = 10;

/**
 * Converts any supported value to a trimmed string.
 */
const getStringValue = (value: unknown): string => {
  return typeof value === "string" ? value.trim() : "";
};

/**
 * Removes duplicate alumni when the same person appears
 * under multiple company groups.
 */
const flattenCompanyAlumni = (
  alumniByCompany?: Record<string, AlumniProfile[]>,
): AlumniProfile[] => {
  if (!alumniByCompany) {
    return [];
  }

  const uniqueProfiles = new Map<string, AlumniProfile>();

  Object.values(alumniByCompany).forEach((profiles) => {
    if (!Array.isArray(profiles)) {
      return;
    }

    profiles.forEach((profile) => {
      if (!profile?._id) {
        return;
      }

      uniqueProfiles.set(String(profile._id), profile);
    });
  });

  return Array.from(uniqueProfiles.values());
};

/**
 * Handles both companiesChecked response formats:
 *
 * ["Google", "Microsoft"]
 *
 * and:
 *
 * [
 *   {
 *     displayName: "Google",
 *     companyName: "Google",
 *     canonicalId: "google"
 *   }
 * ]
 */
const normalizeCompaniesChecked = (
  companies: unknown,
): string[] => {
  if (!Array.isArray(companies)) {
    return [];
  }

  const normalizedCompanies = companies
    .map((company): string => {
      if (typeof company === "string") {
        return company.trim();
      }

      if (!company || typeof company !== "object") {
        return "";
      }

      const companyObject =
        company as CompanyCheckedObject;

      return (
        getStringValue(companyObject.displayName) ||
        getStringValue(companyObject.companyName) ||
        getStringValue(companyObject.canonicalId) ||
        getStringValue(companyObject.key)
      );
    })
    .filter((company): company is string =>
      Boolean(company),
    );

  return Array.from(
    new Map(
      normalizedCompanies.map((company) => [
        company.toLowerCase(),
        company,
      ]),
    ).values(),
  );
};

/**
 * Normalizes the college list returned by the API.
 */
const normalizeColleges = (
  colleges: unknown,
): string[] => {
  if (!Array.isArray(colleges)) {
    return [];
  }

  const normalizedColleges = colleges
    .map((college) => {
      if (typeof college === "string") {
        return college.trim();
      }

      if (!college || typeof college !== "object") {
        return "";
      }

      const collegeObject = college as {
        name?: string | null;
        collegeName?: string | null;
        displayName?: string | null;
      };

      return (
        getStringValue(collegeObject.displayName) ||
        getStringValue(collegeObject.collegeName) ||
        getStringValue(collegeObject.name)
      );
    })
    .filter((college): college is string =>
      Boolean(college),
    );

  return Array.from(
    new Map(
      normalizedColleges.map((college) => [
        college.toLowerCase(),
        college,
      ]),
    ).values(),
  );
};

/**
 * Extracts the alumni list depending on the selected tab.
 */
const getAlumniFromResponse = (
  response: AlumniApiResponse,
  tab: AlumniTab,
): AlumniProfile[] => {
  if (tab === "company") {
    const groupedAlumni = flattenCompanyAlumni(
      response.alumniByCompany,
    );

    /*
     * The backend paginated response may also contain data.
     * Prefer grouped alumni because it is the company-specific
     * response, but use data as a fallback.
     */
    if (groupedAlumni.length > 0) {
      return groupedAlumni;
    }

    return Array.isArray(response.data)
      ? response.data
      : [];
  }

  return Array.isArray(response.data)
    ? response.data
    : [];
};

/**
 * Extracts the total from the common paginated response.
 */
const getTotalCount = (
  response: AlumniApiResponse,
  alumniList: AlumniProfile[],
): number => {
  const metaTotal = Number(response.meta?.total);

  if (Number.isFinite(metaTotal) && metaTotal >= 0) {
    return metaTotal;
  }

  const legacyTotal = Number(response.totalAlumni);

  if (
    Number.isFinite(legacyTotal) &&
    legacyTotal >= 0
  ) {
    return legacyTotal;
  }

  return alumniList.length;
};

const getProfileCollege = (
  profile: AlumniProfile,
): string => {
  const profileWithEducation = profile as AlumniProfile & {
    college?: string | null;
    educations?: Array<{
      college?: string | null;
      institute?: string | null;
      institution?: string | null;
      school?: string | null;
    }>;
  };

  const directCollege = getStringValue(
    profileWithEducation.college,
  );

  if (directCollege) {
    return directCollege;
  }

  const educations =
    profileWithEducation.educations;

  if (!Array.isArray(educations)) {
    return "No college data";
  }

  for (const education of educations) {
    const college =
      getStringValue(education?.college) ||
      getStringValue(education?.institute) ||
      getStringValue(education?.institution) ||
      getStringValue(education?.school);

    if (college) {
      return college;
    }
  }

  return "No college data";
};

const getProfileCompany = (
  profile: AlumniProfile,
): string => {
  const profileWithCompany = profile as AlumniProfile & {
    currentCompany?: string | null;
    currentCompany_display?: string | null;
    company?: string | null;
    experiences?: Array<{
      company?: string | null;
      company_display?: string | null;
    }>;
  };

  const currentCompany =
    getStringValue(
      profileWithCompany.currentCompany_display,
    ) ||
    getStringValue(
      profileWithCompany.currentCompany,
    ) ||
    getStringValue(profileWithCompany.company);

  if (currentCompany) {
    return currentCompany;
  }

  const experiences =
    profileWithCompany.experiences;

  if (Array.isArray(experiences)) {
    for (const experience of experiences) {
      const company =
        getStringValue(
          experience?.company_display,
        ) ||
        getStringValue(experience?.company);

      if (company) {
        return company;
      }
    }
  }

  return "No company data";
};

export default function AlumniPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<AlumniTab>("hiring");

  const [alumni, setAlumni] = useState<
    AlumniProfile[]
  >([]);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [messageLoading, setMessageLoading] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const [collegesList, setCollegesList] =
    useState<string[]>([]);

  const [
    companiesChecked,
    setCompaniesChecked,
  ] = useState<string[]>([]);

  const totalPages = useMemo(() => {
    return Math.max(
      1,
      Math.ceil(totalCount / LIMIT),
    );
  }, [totalCount]);

  const collegeDisplayName = useMemo(() => {
    return collegesList.join(", ");
  }, [collegesList]);

  const companiesDisplay = useMemo(() => {
    return companiesChecked.join(", ");
  }, [companiesChecked]);

  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const apiResponse =
        (await fetchAlumniData(
          activeTab,
          page,
        )) as AlumniApiResponse;

      const alumniList =
        getAlumniFromResponse(
          apiResponse,
          activeTab,
        );

      const count = getTotalCount(
        apiResponse,
        alumniList,
      );

      setAlumni(alumniList);
      setTotalCount(count);

      setCollegesList(
        normalizeColleges(apiResponse.colleges),
      );

      setCompaniesChecked(
        normalizeCompaniesChecked(
          apiResponse.companiesChecked,
        ),
      );
    } catch (fetchError: unknown) {
      console.error(
        "Alumni fetch error:",
        fetchError,
      );

      const errorResponse = fetchError as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };

      const errorMessage =
        errorResponse.response?.data?.message ||
        errorResponse.response?.data?.error ||
        errorResponse.message ||
        "Failed to fetch alumni.";

      setError(errorMessage);
      setAlumni([]);
      setTotalCount(0);
      setCollegesList([]);
      setCompaniesChecked([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    void fetchAlumni();
  }, [fetchAlumni]);

  const handleTabChange = (
    tab: AlumniTab,
  ) => {
    if (tab === activeTab) {
      return;
    }

    setActiveTab(tab);
    setPage(1);
    setAlumni([]);
    setTotalCount(0);
    setCollegesList([]);
    setCompaniesChecked([]);
    setError("");
  };

  const handlePageChange = (
    newPage: number,
  ) => {
    if (
      loading ||
      newPage < 1 ||
      newPage > totalPages ||
      newPage === page
    ) {
      return;
    }

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleMessage = async (
    profile: AlumniProfile,
  ) => {
    const profileData =
      profile as AlumniProfile & {
        userId?: string | null;
        profileImage?: string | null;
        name?: string | null;
      };

    const userId =
      getStringValue(profileData.userId) ||
      getStringValue(profileData._id);

    if (!userId) {
      console.error(
        "Invalid alumni user ID:",
        profile,
      );

      toast.error(
        "Unable to start chat: User ID not found.",
      );

      return;
    }

    if (messageLoading) {
      return;
    }

    try {
      setMessageLoading(userId);

      const userName =
        getStringValue(profileData.name) ||
        "User";

      const profileImage =
        getStringValue(
          profileData.profileImage,
        );

      const searchParams =
        new URLSearchParams();

      searchParams.set("userName", userName);

      if (profileImage) {
        searchParams.set(
          "profileImage",
          profileImage,
        );
      }

      router.push(
        `/fresher/message/${encodeURIComponent(
          userId,
        )}?${searchParams.toString()}`,
      );
    } catch (navigationError) {
      console.error(
        "Error opening chat:",
        navigationError,
      );

      toast.error(
        "Failed to open chat. Please try again.",
      );

      setMessageLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#070b12] px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Alumni Network
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Connect with alumni from your college,
              companies, and hiring network.
            </p>

            {(activeTab === "college" ||
              activeTab === "hiring") &&
              collegeDisplayName && (
                <p className="mt-2 text-sm text-green-400">
                  Colleges: {collegeDisplayName}
                </p>
              )}

            {(activeTab === "company" ||
              activeTab === "hiring") &&
              companiesDisplay && (
                <p className="mt-2 text-sm text-green-400">
                  Companies checked:{" "}
                  {companiesDisplay}
                </p>
              )}
          </div>

          <div className="flex w-full rounded-2xl border border-white/10 bg-[#111821] p-1 sm:w-fit">
            {tabs.map((tab) => {
              const isActive =
                activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleTabChange(tab.key)
                  }
                  className={`flex-1 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none ${
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

        {loading && (
          <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-[#242d3a] bg-[#111821]">
            <div className="flex items-center gap-3 text-slate-300">
              <Loader2 className="h-5 w-5 animate-spin" />

              <span className="text-sm">
                Loading alumni...
              </span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <p className="text-sm text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void fetchAlumni()}
              className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
            >
              Try again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          alumni.length === 0 && (
            <div className="rounded-3xl border border-[#242d3a] bg-[#111821] p-10 text-center">
              <h2 className="text-lg font-semibold text-white">
                No alumni found
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Try another tab or check again
                later.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          alumni.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {alumni.map((profile) => {
                  const collegeFallback =
                    getProfileCollege(profile);

                  const companyFallback =
                    getProfileCompany(profile);

                  return (
                    <AlumniCard
                      key={String(profile._id)}
                      profile={profile}
                      collegeFallback={
                        collegeFallback
                      }
                      companyFallback={
                        companyFallback
                      }
                      onMessage={handleMessage}
                    />
                  );
                })}
              </div>

              <AlumniPagination
                page={page}
                totalPages={totalPages}
                loading={loading}
                onPageChange={handlePageChange}
                currentCount={alumni.length}
                totalCount={totalCount}
              />
            </>
          )}
      </section>
    </main>
  );
}