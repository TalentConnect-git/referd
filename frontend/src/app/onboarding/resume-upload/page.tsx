"use client";

import { useState } from "react";

import ResumeUpload from "@/components/auth/ResumeUpload";

export default function ResumeUploadPage() {
  const [open, setOpen] = useState(true);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      
      <ResumeUpload/>

      
      
    </main>
  );
}