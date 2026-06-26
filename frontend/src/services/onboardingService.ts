import axiosInstance from "@/lib/axiosInstance";

export type ParsedResumeResponse = {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];

  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;

  education?: {
    institution?: string;
    college?: string;
    degree?: string;
    field_of_study?: string;
    specialization?: string;
    year?: string;
    cgpa?: string;
  }[];

  work_experience?: {
    organization?: string;
    title?: string;
    start_date?: string;
    end_date?: string;
    description?: string | string[];
  }[];

  total_experience_years?: number;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const err = error as ApiError;

  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    fallback
  );
};



export async function getColleges() {
  try {
    const { data } =
      await axiosInstance.get(
        "/api/colleges/all"
      );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch colleges"
      )
    );
  }
}

export async function createCollege(
  name: string
) {
  try {
    const { data } =
      await axiosInstance.post(
        "/api/colleges/register",
        {
          name,
        }
      );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to create college"
      )
    );
  }
}

export async function getMasterDataByType(
  type: string,
  parent?: string
) {
  try {
    const params =
      new URLSearchParams({
        type,
      });

    if (parent) {
      params.append("parent", parent);
    }

    const { data } =
      await axiosInstance.get(
        `/api/master-data?${params.toString()}`
      );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch master data"
      )
    );
  }
}


export async function submitOnboardingProfile(formData: FormData) {
  try {
    const { data } = await axiosInstance.post("/api/onboarding", formData);
    console.log(data);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.details ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to submit onboarding profile"
    );
  }
};

export async function createMasterData(
  payload: {
    type: string;
    value: string;
    parent?: string;
  }
) {
  try {
    const { data } =
      await axiosInstance.post(
        "/api/master-data",
        payload
      );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to create data"
      )
    );
  }
}

export async function getCompanyMasterDataByType(
  type: string
) {
  try {
    const params =
      new URLSearchParams({
        type,
      });

    const { data } =
      await axiosInstance.get(
        `/api/company-master-data?${params.toString()}`
      );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch company master data"
      )
    );
  }
}

export async function createCompanyMasterData(
  payload: {
    type: string;
    value: string;
    parent?: string;
  }
) {
  try {
    const { data } =
      await axiosInstance.post(
        "/api/company-master-data",
        payload
      );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to create data"
      )
    );
  }
}

export async function getSkills() {
  try {
    const { data } =
      await axiosInstance.get(
        "/api/meta/get-skills"
      );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch skills"
      )
    );
  }
}

export async function addSkill(
  skills: string
) {
  try {
    const { data } =
      await axiosInstance.post(
        "/api/meta/add-skill",
        {
          skills,
        }
      );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to add skill"
      )
    );
  }
}


