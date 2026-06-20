"use client";

import { Notification } from "@/types/notification";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { handleBuildComplete } from "next/dist/build/adapter/build-complete";

export default function NotificationsDropdown() {
const { notifications } = useNotification();
const router = useRouter();
const { profile, user } = useAuth();

const userType =
  profile?.profileType ||
  user?.userType ||
  "student";

//   const handleNotificationClick = (
//   notification: Notification
// ) => {
//   const topic = notification.meta?.topic;

//   switch (topic) {
//     case "Jobs":
//     case "Job Detail":
//       router.push(`/${userType}/jobs`);
//       break;

//     case "Referrals":
//     case "Referrer":
//       router.push(`/${userType}/applications`);
//       break;

//     default:
//       router.push(`/${userType}/home`);
//   }
// };


const handleNotificationClick = (
  notification: Notification
) => {
  const topic = notification.meta?.topic;
  const subtopic = notification.meta?.subtopic;
  const body = notification.meta?.body;

  switch (topic) {

    // Maps to: Jobs -> My Posted / JobDetail
    case "Jobs": {
      const jobId = body?.jobId;

      if (!jobId) {
        router.push(`/${userType}/jobs`);
        return;
      }

      if (subtopic === "My Posted") {
        router.push(`/${userType}/applications`);
        return;
      }

      if (subtopic === "JobDetail") {
        const jobType =
          notification.jobType?.toLowerCase();

        if (jobType === "referral") {
          router.push(
            `/${userType}/jobs/referral-jobs/${jobId}`
          );
          return;
        }

        router.push(
          `/${userType}/jobs/offcampus/${jobId}`
        );
        return;
      }

      router.push(`/${userType}/jobs`);
      return;
    }

    // Maps to: Job Detail -> Candidates
    // case "Job Detail":
    //   router.push(`/${userType}/applications`);
    //   return;


      case "Job Detail": {
      const applicationId =
        body?.applicationId;
      if (!applicationId) {
        router.push(`/${userType}/applications`);
        return;
      }

      router.push(
        `/${userType}/applications/to-me/${applicationId}`
      );
      return;

    }

    // Maps to: Referrals -> Received Requests
    // case "Referrals":
    //   router.push(`/${userType}/applications`);
    //   return;

    case "Referrals": {

      const applicationId =
        body?.applicationId;
      if (!applicationId) {
        router.push(`/${userType}/applications`);
        return;
      }
      router.push(
        `/${userType}/applications/to-me/${applicationId}`
      );
      return;
    }



    // Maps to: Referrer -> Applied By Me
    case "Referrer":
      router.push(`/${userType}/applications`);
      return;

    // Maps to: Scheduled Interviews
    case "Scheduled Interviews":
      router.push(`/${userType}/applications`);
      return;

    // Maps to: Alumni Network -> Alumni Detail
    // case "Alumni Network":
    //   router.push(`/${userType}/alumani-network`);
    //   return;


    case "Alumni Network": {

      const userId = body?.userId;
      if (!userId) {
        router.push(
          `/${userType}/alumani-network`
        );
        return;
      }
      router.push(
        `/${userType}/alumani-network/${userId}`
      );
      return;
    }

    // Maps to: Chat
    case "Chat":
      return;

    default:
      router.push(`/${userType}/dashboard`);
  }
};


  return (
    <div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-[var(--text-primary)]">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              style={{
                border: "1px solid var(--border)",
                padding: "16px",
                cursor: "pointer",
                borderRadius: "12px",
                }}

            onMouseEnter={(e) => {
            e.currentTarget.style.border = "1px solid #22c55e";
            }}

            onMouseLeave={(e) => {
            e.currentTarget.style.border = "1px solid var(--border)";
            }}

            onClick={()=>handleNotificationClick(notification)}
              className="
                border
                border-[var(--border)]
                p-4
                cursor-pointer
                "
            >
              <p className="text-sm text-white">
                {notification.message}
              </p>
              <p className="mt-1 text-xs text-[var(--text-primary)]">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



