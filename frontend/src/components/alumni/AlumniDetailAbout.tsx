import { AlumniDetailProfileProps } from "@/types/alumni";

export default function AlumniDetailAbout({
  profile,
}: AlumniDetailProfileProps) {
  const about =
    profile.about ||
    "";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="mb-5 text-xl font-semibold text-white">
        About
      </h2>

      {about ? (
        <p className="leading-7 text-gray-300">
          {about}
        </p>
      ) : (
        <p className="italic text-gray-500">
          No information available.
        </p>
      )}
    </div>
  );
}