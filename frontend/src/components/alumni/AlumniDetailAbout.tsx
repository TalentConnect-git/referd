import { AlumniDetailAboutProps } from "@/types/alumni";

export default function AlumniDetailAbout({
  about,
}: AlumniDetailAboutProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6">
      <h2 className="mb-4 text-xl font-semibold text-blue-400">
        About
      </h2>

      <p className="leading-7 text-slate-300">
        {about || "No description available."}
      </p>
    </div>
  );
}