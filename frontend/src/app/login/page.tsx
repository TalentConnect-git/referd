// import LoginForm from "@/components/auth/LoginForm";
// import LoginInfoPanel from "@/components/auth/LoginInfoPanel";

// export default function LoginPage() {
//   return (
//     <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 py-20">
//       <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
//         <LoginInfoPanel />
//         <LoginForm />
//       </div>
//     </main>
//   );
// }



"use client";

import LoginCallback from "@/components/auth/LoginCallback";
import { Suspense } from "react";
export default function LoginPage()
{
  return (
    <Suspense>
      <LoginCallback />
    </Suspense>
  )
}
  ;
