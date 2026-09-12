import { ReferralJob } from "@/types/referral";

export type ReferralDisplayStatus = "Live" | "Paused" | "Closed";

export const isReferralExpired = (referral: Partial<ReferralJob>) => {
    const normalizedStatus = (referral.jobStatus || "").toLowerCase();

    if (normalizedStatus.includes("expired")) {
        return true;
    }

    if (!referral.endDate) {
        return false;
    }

    const endDate = new Date(referral.endDate);

    if (Number.isNaN(endDate.getTime())) {
        return false;
    }

    return endDate.getTime() < Date.now();
};

export const getReferralDisplayStatus = (
    referral: Partial<ReferralJob>
): ReferralDisplayStatus => {
    if (isReferralExpired(referral)) {
        return "Closed";
    }

    if (referral.inactive) {
        return "Paused";
    }

    return "Live";
};
