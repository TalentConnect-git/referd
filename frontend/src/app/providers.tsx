"use client";

import { AuthContextRole } from "@/context/AuthContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthContextRole>{children}</AuthContextRole>;
}