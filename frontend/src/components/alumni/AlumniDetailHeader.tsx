"use client";
import { AlumniDetailProfileProps } from "@/types/alumni";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  BriefcaseBusiness,
  Briefcase,
  MessageSquare,
  User,
  BadgeCheck,
} from "lucide-react";
import defaultUser from "@/../public/images/default-user.png";
import { useAuth } from "@/context/AuthContext";


export default function AlumniDetailHeader({profile}: AlumniDetailProfileProps) {

    const router = useRouter();
    const { role: userType } = useAuth();
    const currentExperience =
    profile.experiences?.find(
      (exp) => exp.isCurrent || !exp.endDate
    ) || profile.experiences?.[0];
  const currentRole = currentExperience?.role || "Professional";
  const college = profile.educations?.find((e) => e.isCurrent)?.college || profile.educations?.[0]?.college || "College not available";
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">

      <div className="flex gap-6">

        {/* Profile Image */}

        <Image src={profile.profileImage || "/images/default-user.png"} alt= "User" width={80} height={80} className="h-20 w-20 rounded-full object-cover border border-slate-700"/>

        {/* Details */}

        <div className="flex-1">

          <div className="flex items-center gap-2">

            <h1 className="text-xl font-bold text-white">
              {profile.name}
            </h1>

            <BadgeCheck
              size={19}
              className="text-green-500"

            />

          </div>

          <div className="mt-4 space-y-3 text-gray-300">
            <div className="flex items-center gap-3">
              <GraduationCap size={18} className="text-blue-400" />
              <span>{college}</span>

            </div>

            <div className="flex items-center gap-3">
              <BriefcaseBusiness size={18} className="text-blue-400" />
              <span>
                {currentRole} @ {profile.currentCompany}
              </span>

            </div>
            <div className="flex items-center gap-3">
              <Briefcase size={18} className="text-blue-400" />
              <span>
                {profile.totalYearsOfExperience || 0} years experience
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Buttons */}

      <div className="mt-8 flex gap-4">

        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 py-3 font-semibold text-white transition hover:bg-[#16a34a]"
        >
          <MessageSquare size={18} className="text-white" />
          Message
        </button>

        <button
          onClick={() =>
            router.push(
              `/${userType}/profile/${profile.userId}`
            )
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#22c55e] py-3 font-semibold text-[#22c55e] transition hover:bg-green-500 text-white"
        >
          <User size={18} />
          Show Profile
        </button>

      </div>

    </div>
  );
}