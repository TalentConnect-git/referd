import { StageIndicatorProps } from "@/types/applications";

export default function StageIndicator({
  stage,
}: StageIndicatorProps) {
  const STAGES = [
    "Applied",
    "Referral Sent",
    "Under Review",
    "Interview",
    "Selected",
    "Offer",
    "Joined",
  ];

  const STAGE_MAP: Record<string, number> = {
    // Stage 1
    Applied: 0,

    // Stage 2
    "Referral Sent": 1,
    "Application Sent": 1,
    "Referred To Company": 1,

    // Stage 3
    "Under Review": 2,

    // Stage 4
    Interview: 3,

    // Stage 5
    Selected: 4,
    Accepted: 4,

    // Stage 6
    Offer: 5,

    // Stage 7
    Joined: 6,
    Hired: 6,
  };

  const currentIndex = STAGE_MAP[stage] ?? 0;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {STAGES.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 w-7 rounded-full ${
              index <= currentIndex
                ? "bg-green-500"
                : "bg-slate-700"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-green-500">
        {stage}
      </p>
    </div>
  );
}