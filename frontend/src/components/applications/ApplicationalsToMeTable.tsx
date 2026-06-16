"use client";

import StageIndicator from "./StageIndicator";

interface ApplicationalsToMeTableProps {
  applications: any[];
  page: number;
  meta: any;
}

export default function ProfessionalAppTable({
  applications,
}: ApplicationalsToMeTableProps) {
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
                className="border-t border-slate-800"
              >
                <td className="px-6 py-4">
                  {application?.applicantName || "N/A"}
                </td>

                <td className="px-6 py-4">
                  {application?.jobTitle || "N/A"}
                </td>

                <td className="px-6 py-4">
                  {
                    application?.academicBackground
                      ?.collegeName || "N/A"
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