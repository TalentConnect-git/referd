"use client";

import { useState } from "react";

import ResumeUpload from "@/components/auth/ResumeUpload";

export default function ResumeUploadPage() {
  const [open, setOpen] = useState(true);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="w-full max-w-3xl">
        <ResumeUpload />
      </div>
    </main>
  );
}