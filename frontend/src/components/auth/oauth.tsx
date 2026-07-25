"use client";

import { MouseEvent, useState } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";

import { app } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "../../lib/axiosInstance";

type GoogleLoginResponse = {
  success: boolean;
  message?: string;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    photo?: string;
    userType?: "student" | "fresher" | "professional";
    onboardingCompleted?: boolean;
  };
};

export default function GoogleOAuthButton() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  // const {token,setUser}=useAuth();

  const handleGoogleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const { data } = await axiosInstance.post<GoogleLoginResponse>(
        "/api/auth/google",
        {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }
      );

      if (!data.success) {
        toast.error(data.message || "Google login failed");
        return;
      }
      console.log(data);

      // login(data.user, data.token);
      // toast.success("Login successful!");
    } catch (error) {
      const firebaseError = error as FirebaseError;

      console.error("Could not sign in with Google:", error);

      if (firebaseError.code === "auth/popup-closed-by-user") {
        toast.error("Google sign-in cancelled");
        return;
      }

      toast.error("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      disabled={loading}
      className="btn-secondary flex h-11 w-full items-center justify-center rounded-lg border border-theme bg-background-soft/50 text-[14px] font-semibold text-primary transition hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Connecting..." : "Continue with Google"}
    </button>
  );
}