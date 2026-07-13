import { AlumniCardProps } from "@/types/dashboard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  MessageCircle,
  Briefcase,
  GraduationCap,
  Building2,
  User,
  ChevronRight,
} from "lucide-react";

export default function AlumniCard({
  name,
  role,
  company,
  college,
  openRoles,
  userId,
  profileImage,
  onClick,
}: AlumniCardProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const { role: userType } = useAuth();
  const router = useRouter();

  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${userType}/message/${userId}?userName=${name}`);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group rounded-xl border border-[#2a3a52] bg-[#0f172a] p-4 transition-all duration-200 hover:border-green-500/30 hover:bg-[#1a2332] cursor-pointer"
    >
      <div className="flex items-start gap-3">
        {/* Profile Image */}
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-[#2a3a52] group-hover:border-green-500/40 transition-colors">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <span className="text-sm font-semibold text-white">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors truncate">
              {name}
            </h3>
            {openRoles > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] font-medium text-green-400 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                {openRoles}
              </span>
            )}
          </div>

          <div className="mt-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <p className="text-xs text-slate-400 truncate">
                {role} <span className="text-slate-600">•</span> {company}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <p className="text-xs text-slate-500 truncate">{college}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Button */}
      <button
        onClick={handleMessageClick}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#2a3a52] bg-[#0f172a] px-3 py-2 text-xs font-medium text-slate-400 transition-all duration-200 hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-400"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        Message
      </button>
    </div>
  );
}