"use client";

import { useNotification } from "@/context/NotificationContext";
import NotificationsCard from "./NotificationsCard";
import { Notification } from "@/types/notification";

export default function NotificationsContainer() {
  // get notifications from context 
  const { notifications } = useNotification();

  const dummynotifications: Notification[] = [
  {
    _id: "1",
    message: "Your application has been accepted",
    type: "APPLICATION_ACCEPTED",
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    _id: "2",
    message: "A new referral matches your profile",
    type: "NEW_MATCHING_REFERRAL_JOB",
    createdAt: new Date().toISOString(),
    read: true,
  },
];

  return (
    <div className="space-y-4 ml-5 mt-5">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Notifications
        </h1>

        <p className="mt-2 text-[var(--text-primary)]">
          Stay updated with referral activity,
          applications, interviews, and messages.
        </p>
      </div>

      <div className="mt-10">
        {dummynotifications.length === 0 ? (
          <div>No notifications found</div>
        ) : (
          dummynotifications.map((notification) => (
            <NotificationsCard
              key={notification._id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
}