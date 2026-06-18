"use client";

import { useState } from "react";
import { NotificationsCardProps } from "@/types/notification";
import { Notification } from "@/types/notification";

export default function NotificationsCard({
  notification,
}: NotificationsCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        border: isHovered
          ? "1px solid #31aa40"
          : "1px solid var(--border)",
        boxShadow: isHovered
          ? "0 0 20px rgba(49, 170, 64, 0.15)"
          : "none",
      }}
      className="
        mr-5
        mb-7
        rounded-2xl
        bg-[var(--card)]
        p-5
        transition-all
        duration-200
        cursor-pointer
      "
    >
      <div className="flex items-start gap-4">
        {!notification.read && (
          <div className="mt-2 h-3 w-3 rounded-full bg-green-500 shrink-0" />
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-white">
              {notification.message}
            </p>

            {!notification.read && (
              <span
                className="
                  rounded-full
                  bg-green-500/15
                  px-2
                  py-1
                  text-xs
                  font-medium
                  text-green-400
                "
              >
                New
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-gray-400">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}