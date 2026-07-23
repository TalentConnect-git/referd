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

    // ✅ Phone validation removed - no longer required
    if (name === "phone") {
      // Only validate if a value is entered
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
    <div className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-[var(--border)] bg-[var(--background)] p-7 shadow-2xl lg:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)]">
              <User className="h-8 w-8 text-[var(--primary)]" />
            </div>

            <h1 className="text-[26px] font-bold tracking-[-0.04em] text-white">
              Basic Information
            </h1>

            <p className="mt-2 text-[13px] text-[var(--text-primary)]">
              This information will be visible to recruiters.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[13px] font-medium text-white">
                Your Name <span className="text-red-400">*</span>
              </label>

              <div
                className={`flex h-11 items-center rounded-lg border px-4 transition ${
                  errors.name
                    ? "border-red-400/50 bg-red-400/10"
                    : "border-white/10 bg-[var(--background)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/15"
                }`}
              >
                <User className="mr-3 h-5 w-5 text-[var(--text-primary)]" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-[var(--text-muted)]"
                />
              </div>

              {errors.name && (
                <p className="mt-2 flex items-center text-[12px] text-red-400">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] font-medium text-white">
                  Email ID <span className="text-red-400">*</span>
                </label>

                <div
                  className={`flex h-11 items-center rounded-lg border px-4 transition ${
                    errors.email
                      ? "border-red-400/50 bg-red-400/10"
                      : "border-white/10 bg-[var(--background)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/15"
                  }`}
                >
                  <MailIcon className="mr-3 h-5 w-5 text-[var(--text-primary)]" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-[var(--text-muted)]"
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 flex items-center text-[12px] text-red-400">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-white">
                  Phone Number <span className="text-gray-400 text-[11px]"></span>
                </label>

                <div
                  className={`flex h-11 items-center rounded-lg border px-4 transition ${
                    errors.phone
                      ? "border-red-400/50 bg-red-400/10"
                      : "border-white/10 bg-[var(--background)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/15"
                  }`}
                >
                  <PhoneIcon className="mr-3 h-5 w-5 text-[var(--text-primary)]" />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-[var(--text-muted)]"
                  />
                </div>

                {errors.phone && (
                  <p className="mt-2 flex items-center text-[12px] text-red-400">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 flex-1 items-center justify-center rounded-lg border border-white/10 text-[13px] font-semibold text-white transition hover:bg-white/10"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="button-color flex h-10 flex-1 items-center justify-center rounded-lg text-[13px] font-semibold text-black transition-all duration-300 hover:brightness-110 active:scale-[0.99]"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}