import {AlumniCardProps} from '@/types/dashboard'
import Image from "next/image";
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
    .toUpperCase();

    console.log("Vasvi");
    console.log("Image url got is ",profileImage);

  return (
    <div className="rounded-xl border border-[#334155] bg-[#162033] p-6">
      <div className="flex gap-4" onClick={onClick}>

      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#334155]">
        <Image
        src={profileImage || "/images/default-user.png"}
        alt={name}
        fill
        className="object-cover"
        />

</div>


        <div>
          <h3 className="text-md font-semibold text-white">
            {name}
          </h3>

          <p className="text-sm text-gray-400">
            {role} • {company}
          </p>

          <p className="mt-2 text-sm text-gray-400">
            {college} • <span className={openRoles > 0 ? "text-green-500" : "text-gray-500"}>{openRoles} open roles</span> 
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button className="flex-1 rounded-lg border border-[#334155] bg-[#0f172a] py-2 text-sm font-medium text-white hover:bg-green-500 text-white">
          Message
        </button>

        {/* <button className="flex-1 rounded-lg bg-green-500 py-2 text-sm font-medium text-black hover:bg-green-400">
          Request Referral
        </button> */}
      </div>
    </div>
  );
}