import {AlumniCardProps} from '@/types/dashboard'
export default function AlumniCard({
  name,
  role,
  company,
  college,
  openRoles,
  userId,
  onClick,
}: AlumniCardProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-xl border border-[#334155] bg-[#162033] p-6">
      <div className="flex gap-4" onClick={onClick}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-900 text-lg font-bold text-green-400">
          {initials}
        </div>

        <div>
          <h3 className="text-md font-semibold text-white">
            {name}
          </h3>

          <p className="text-sm text-gray-400">
            {role} • {company}
          </p>

          <p className="mt-2 text-sm text-gray-400">
            {college} • {openRoles} open roles
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button className="flex-1 rounded-lg border border-[#334155] bg-[#0f172a] py-2 text-sm font-medium text-white hover:bg-[#1e293b]">
          Message
        </button>

        <button className="flex-1 rounded-lg bg-green-500 py-2 text-sm font-medium text-black hover:bg-green-400">
          Request Referral
        </button>
      </div>
    </div>
  );
}