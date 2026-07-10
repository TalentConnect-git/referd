import { AlumniCardProps } from "@/types/dashboard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MessageCircle, Briefcase, GraduationCap, Building2, User, ChevronRight } from "lucide-react";

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

  return (
    <div 
      className="group relative rounded-xl border border-slate-800 bg-[#0f172a] p-3.5 transition-all duration-200 hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900/30 hover:-translate-y-0.5 cursor-pointer"
      onClick={onClick}
    >
      {/* Status Indicator */}
      {openRoles > 0 && (
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          <span className="text-[9px] font-medium text-green-400">Hiring</span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Profile Image */}
        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-slate-700/50 group-hover:border-green-500/40 transition-colors duration-200">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <span className="text-sm font-semibold text-white">{initials}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-semibold text-white group-hover:text-green-400 transition-colors duration-200 truncate">
            {name}
          </h3>

          <div className="flex items-center gap-1 mt-0.5">
            <Briefcase className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <p className="text-[11px] text-gray-400 truncate">
              {role} <span className="text-gray-600">•</span> {company}
            </p>
          </div>

          <div className="flex items-center gap-1 mt-0.5">
            <GraduationCap className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <p className="text-[11px] text-gray-500 truncate">{college}</p>
          </div>

          {/* Open Roles Badge */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium border ${
              openRoles > 0 
                ? 'border-green-500/30 bg-green-500/10 text-green-400' 
                : 'border-gray-500/20 bg-gray-500/5 text-gray-500'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${openRoles > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></span>
              {openRoles} open role{openRoles !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Message Button */}
      <div className="mt-3.5">
        <button
          onClick={handleMessageClick}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-[#0f172a] px-3 py-2 text-[11px] font-medium text-white transition-all duration-200 hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-400 group/btn"
        >
          <MessageCircle className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
          Message
        </button>
      </div>

      {/* Hover gradient overlay */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/0 to-transparent transition-opacity duration-300 pointer-events-none group-hover:opacity-5`} />
    </div>
  );
}