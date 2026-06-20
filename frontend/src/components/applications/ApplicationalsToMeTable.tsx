"use client";

import StageIndicator from "./StageIndicator";
import { ApplicationalsToMeTableProps } from "@/types/applications";
import { useRouter } from "next/navigation";

export default function ProfessionalAppTable({
  applications,
}: ApplicationalsToMeTableProps) {
   const router = useRouter();
  return (
    <div className="rounded-3xl border border-slate-800 overflow-hidden min-h-[420px]">
      <table className="w-full">
        <thead className="bg-[#111827]">
          <tr className="text-left text-gray-400">
            <th className="px-6 py-4">Applicant</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">College</th>
            <th className="px-6 py-4">Stage</th>
            <th className="px-6 py-4">Applied</th>
            <th className="px-6 py-4">Match Score</th>
          </tr>
        </thead>

        <tbody>
          {applications.length > 0 ? (
            applications.map((application: any) => (
              <tr
                key={application._id}
                onClick={() =>
                  router.push(
                    `/professional/applications/to-me/${application._id}`
                  )}
                className="border-t border-slate-800 cursor-pointer"
              >
                <td className="px-6 py-4">
                  {application?.applicant.name || "N/A"}
                </td>

                <td className="px-6 py-4">
                  {application?.job?.jobTitle?.[0] || "N/A"}
                </td>

                <td className="px-6 py-4">
                  {
                    application?.applicant.educations?.[0].college
                      || "N/A"
                  }
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
                  {application?.matchScore ?? 0}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center text-slate-400 py-20"
              >
                No applications received yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}