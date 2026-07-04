// import SignupForm from "@/components/auth/SignupForm";
// import SignupInfoPanel from "@/components/auth/SignupInfoPanel";

// export default function SignupPage() {
//   return (
//     <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 py-20">
//       <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
//         <SignupInfoPanel />
//         <SignupForm />
//       </div>
//     </main>
//   );
// }


"use client";
import SignupCallback from "@/components/auth/SignupCallback";
import {Suspense} from "react"
export default function SignUpPage()
{
    return (
      <Suspense>
        <SignupCallback />
      </Suspense>
    );
  }

  
