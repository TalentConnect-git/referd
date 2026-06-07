interface AluminiCardProps {
  name: string;
  role: string;
  company: string;
  college: string;
  openRoles: number;
}

export default function AluminiCard({name,role,company,college,openRoles,}: AluminiCardProps) 
{
  const initials = name.split(" ").map((word) => word[0]).join("");

  return (
    <div className="rounded-xl border border-[#334155] bg-[#162033] p-6">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-900 text-lg font-bold text-green-400">
          {initials}
        </div>

        <div>
          <h3 className="text-md font-semibold text-white">
            {name}
          </h3>

          <p className="text-gray-400 text-sm">
            {role} • {company}
          </p>

          <p className="mt-2 text-gray-400 text-sm">
            {college} • {openRoles} open roles
          </p>
        </div>

      </div>

      <div className="mt-6 flex gap-4">

        <button className="flex-1 rounded-xl border border-[#334155] bg-[#0f172a] py-2 text-md font-medium text-white hover:bg-[#1e293b]">
          Message
        </button>

        <button className="flex-1 rounded-xl bg-green-500 py-2 text-md font-medium text-black hover:bg-green-400">
          Request Refer
        </button>

      </div>

    </div>
  );
}