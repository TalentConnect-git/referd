import { AlumniDetailProfileProps } from "@/types/alumni";
import { User, Quote } from "lucide-react";

export default function AlumniDetailAbout({
  profile,
}: AlumniDetailProfileProps) {
  const about = profile.about || "";

  return (
    <div className="rounded-2xl border border-[#2a3a52] bg-gradient-to-r from-[#111827] to-[#1a2332] p-4 shadow-xl shadow-black/20 backdrop-blur-sm">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
        <User size={16} className="text-blue-400" />
        About
      </h2>

      {about ? (
        <div className="relative rounded-xl border border-[#2a3a52] bg-[#0f172a] p-3.5">
          {/* Quote Icon */}
          <div className="absolute top-3 right-3 opacity-20">
            <Quote size={20} className="text-blue-400" />
          </div>
          
          <p className="text-xs text-slate-300 leading-relaxed">
            {about}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#2a3a52] bg-[#0f172a] py-6 text-center">
          <User size={24} className="mx-auto mb-2 text-slate-600" />
          <p className="text-xs text-slate-500">
            No information available.
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5">
            This user hasn't added an about section yet
          </p>
        </div>
      )}
    </div>
  );
}