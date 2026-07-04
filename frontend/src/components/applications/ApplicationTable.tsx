import StageIndicator from "./StageIndicator";
import { ApplicationTableProps } from "@/types/applications";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function sApplicationTable({
  applicationType,
  applications,
  page,
  meta,
}: ApplicationTableProps) {
  const { user } = useAuth();
  const userType = user?.userType;
  const router = useRouter();
   return (
    <div className="rounded-3xl border border-slate-800 overflow-hidden min-h-[420px] flex flex-col ml-5">
      <table className="w-full ">
        <thead className="bg-[#111827]">
          <tr className="text-left text-gray-400">
            <th className="px-6 py-4">Company</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Stage</th>
            <th className="px-6 py-4">Applied</th>
            <th className="px-6 py-4">Match Score</th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 ? (
    <tr>

      <td
        colSpan={5}
        className="h-[320px] text-center"
      >

        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-medium text-gray-300">
            No {applicationType} applications found
          </p>

          <p className="mt-2 text-sm text-gray-500">
            You haven't applied to any {applicationType.toLowerCase()} opportunities yet.
          </p>
        </div>
      </td>
    </tr>
    ) : (

    applications.map((application: any) => (

      <tr
        key={application._id}
        className="border-t border-slate-800"
        onClick={() =>

    router.push(`/${userType}/applications/${application._id}`)

  }
      >

        <td className="px-6 py-4">
          {application?.displayCompanyName || "Louis Company"}
        </td>

        {/* <Link href={`/student/applications/${application._id}`} className="block hover:text-green-500">
        {application?.displayCompanyName || "Louis Company"}
        </Link> */}

        <td className="px-6 py-4">
          {application?.jobDetails?.jobTitle?.[0] || "N/A"}
        </td>

        <td className="px-6 py-4">

          <StageIndicator
            stage={application?.currentStatus}
          />
        </td>

        <td className="px-6 py-4">

          {new Date(
            application?.createdAt
          ).toLocaleDateString()}

        </td>
        <td className="px-6 py-4">
          {application?.matchScore}
        </td>
      </tr>

    ))

  )}
        </tbody>
      </table>
    </div>
  );

}



