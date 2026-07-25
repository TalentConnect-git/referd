"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ChevronLeft, ChevronRight, MailIcon, PhoneIcon, User } from "lucide-react";

type BasicInfoFormData = {
  name: string;
  email: string;
  phone: string;
};

type ValidationErrors = Partial<Record<keyof BasicInfoFormData, string>>;

type ParsedResume = {
  name?: string;
  email?: string;
  phone?: string;
};

export default function BasicInfoForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<BasicInfoFormData>({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    const parsedResume = localStorage.getItem("parsedResume");
    const user = localStorage.getItem("user");

    const parsedData: ParsedResume | null = parsedResume
      ? JSON.parse(parsedResume)
      : null;

    const userData = user ? JSON.parse(user) : null;

    setFormData({
      name: parsedData?.name || "",
      email: parsedData?.email || userData?.email || "",
      phone: parsedData?.phone || "",
    });
  }, []);

  const validateField = (name: keyof BasicInfoFormData, value: string) => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) error = "Name is required";
      else if (value.trim().length < 2) error = "Name must be at least 2 characters";
    }

    if (name === "email") {
      if (!value.trim()) error = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Please enter a valid email";
      }
    }

    if (name === "phone") {
      if (value.trim() && !/^\+?[0-9\s\-()]{10,}$/.test(value)) {
        error = "Please enter a valid phone number";
      }
    }

    return error;
  };

  const validateAll = () => {
    const newErrors: ValidationErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let cleanedValue = value;

    if (name === "name") {
      cleanedValue = value.replace(/[^a-zA-Z\s.'-]/g, "");
    }

    if (name === "phone") {
      cleanedValue = value.replace(/[^0-9\s+\-()]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof BasicInfoFormData;
    const error = validateField(name, e.target.value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleNext = () => {
    if (!validateAll()) return;

    localStorage.setItem("basicInfo", JSON.stringify(formData));

    router.push("/onboarding/stepThree");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text-primary)] sm:px-5 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl items-center justify-center">
        <div className="surface-card w-full rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl sm:p-7 lg:p-10">
          <div className="mb-6 text-center sm:mb-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)] sm:mb-4 sm:h-16 sm:w-16">
              <User className="h-6 w-6 text-[var(--primary)] sm:h-8 sm:w-8" />
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.04em] text-[var(--text-primary)] sm:text-[26px]">
              Basic Information
            </h1>

            <p className="mt-1 text-xs text-[var(--text-muted)] sm:mt-2 sm:text-sm">
              This information will be visible to recruiters.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                Your Name <span className="text-[var(--danger)]">*</span>
              </label>

              <div
                className={`flex h-10 items-center rounded-lg border px-3 transition sm:h-11 sm:px-4 ${
                  errors.name
                    ? "border-[var(--danger-border)] bg-[var(--danger-soft)]"
                    : "border-[var(--border)] bg-[var(--background-soft)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--focus-ring)]"
                }`}
              >
                <User className="mr-2 h-4 w-4 text-[var(--text-muted)] sm:mr-3 sm:h-5 sm:w-5" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full bg-transparent text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] sm:text-sm"
                />
              </div>

              {errors.name && (
                <p className="mt-1.5 flex items-center text-[11px] text-[var(--danger)] sm:mt-2 sm:text-xs">
                  <AlertCircle className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                  Email ID <span className="text-[var(--danger)]">*</span>
                </label>

                <div
                  className={`flex h-10 items-center rounded-lg border px-3 transition sm:h-11 sm:px-4 ${
                    errors.email
                      ? "border-[var(--danger-border)] bg-[var(--danger-soft)]"
                      : "border-[var(--border)] bg-[var(--background-soft)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--focus-ring)]"
                  }`}
                >
                  <MailIcon className="mr-2 h-4 w-4 text-[var(--text-muted)] sm:mr-3 sm:h-5 sm:w-5" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full bg-transparent text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] sm:text-sm"
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 flex items-center text-[11px] text-[var(--danger)] sm:mt-2 sm:text-xs">
                    <AlertCircle className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                  Phone Number
                </label>

                <div
                  className={`flex h-10 items-center rounded-lg border px-3 transition sm:h-11 sm:px-4 ${
                    errors.phone
                      ? "border-[var(--danger-border)] bg-[var(--danger-soft)]"
                      : "border-[var(--border)] bg-[var(--background-soft)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--focus-ring)]"
                  }`}
                >
                  <PhoneIcon className="mr-2 h-4 w-4 text-[var(--text-muted)] sm:mr-3 sm:h-5 sm:w-5" />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full bg-transparent text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] sm:text-sm"
                  />
                </div>

                {errors.phone && (
                  <p className="mt-1.5 flex items-center text-[11px] text-[var(--danger)] sm:mt-2 sm:text-xs">
                    <AlertCircle className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex h-10 flex-1 items-center justify-center rounded-lg text-xs font-semibold sm:h-11 sm:text-sm"
            >
              <ChevronLeft className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="btn-primary flex h-10 flex-1 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-300 active:scale-[0.99] sm:h-11 sm:text-sm"
            >
              Next
              <ChevronRight className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}