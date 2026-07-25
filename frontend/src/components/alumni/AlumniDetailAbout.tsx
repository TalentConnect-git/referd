import { AlumniDetailProfileProps } from "@/types/alumni";
import { User, Quote } from "lucide-react";

export default function AlumniDetailAbout({
  profile,
}: AlumniDetailProfileProps) {
  const about = profile.about || "";

  return (
    <div className="card rounded-2xl border border-theme bg-gradient-to-r from-card to-card-soft p-4 shadow-xl shadow-black/20 backdrop-blur-sm">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
        <User size={16} className="text-info" />
        About
      </h2>

      {about ? (
        <div className="relative rounded-xl border border-theme bg-background p-3.5">
          {/* Quote Icon */}
          <div className="absolute top-3 right-3 opacity-20">
            <Quote size={20} className="text-info" />
          </div>
          
          <p className="text-xs text-secondary leading-relaxed">
            {about}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-theme bg-background py-6 text-center">
          <User size={24} className="mx-auto mb-2 text-muted" />
          <p className="text-xs text-muted">
            No information available.
          </p>
          <p className="text-[10px] text-muted/60 mt-0.5">
            This user hasn't added an about section yet
          </p>
        </div>
      )}
    </div>
  );
}