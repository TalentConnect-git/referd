"use client";

import { CheckCircle } from "lucide-react";

const stages = [
  "Applied",
  "Application Sent",
  "Referred To Company",
  "Shortlisted",
  "Interview Scheduled",
  "Offer Extended",
  "Offer Accepted / Offer Rejected",
  "Joined the Company",
];

interface TimelineProps {
  currentStatus: string;
}

export default function ApplicationTimeline({
  currentStatus,
}: TimelineProps) {
  // const activeIndex = stages.findIndex(
  //   (stage) => stage === currentStatus
  // );

  const normalizedStatus =
  currentStatus === "Accepted"
    ? "Referred To Company"
    : currentStatus;

const activeIndex = stages.findIndex(
  (stage) => stage === normalizedStatus
);

  return (
    <div className="space-y-0 ml-5">
      {stages.map((stage, index) => {
        const completed = index <= activeIndex;

        return (
          <div
            key={stage}
            className="flex items-start"
          >
            <div className="flex flex-col items-center mr-4">
              {completed ? (
                <CheckCircle
                  size={20}
                  className="text-green-500 mr-5"
                />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-500 mr-5" />
              )}

              {index !== stages.length - 1 && (
                <div className="w-[2px] h-10 bg-gray-700" />
              )}
            </div>

            <div className="pt-[1px]">
              <p
                className={`text-sm ${
                  completed
                    ? "text-white font-medium"
                    : "text-gray-400"
                }`}
              >
                {stage}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}