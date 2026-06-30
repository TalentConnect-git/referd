// components/Navbar.tsx
"use client";

import { Bell, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetAllUsers } from "@/hooks/useGetAllUsers";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import NotificationsDropdown from "../notifications/NotificationsDropDown";

export default function Navbar() {
  const { profile, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get total unread count - this will update in real-time
  const { totalUnread } = useGetAllUsers();

  const displayName =
    profile?.fullName ||
    profile?.name ||
    user?.name ||
    "User";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const userType =
    profile?.profileType ||
    user?.userType ||
    "student";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <header
      className="
        mb-6
        flex
        h-20
        items-center
        justify-between
        border-b
        border-[var(--border)]
        bg-[var(--background)]
        px-10
      "
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--primary)]">
          <span className="h-2 w-2 rounded-full bg-black" />
        </div>

        <span className="text-xl font-bold tracking-tight text-white">
          Referd
          <span className="text-[var(--primary)]">.</span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5">
        {/* Chat Icon with Unread Badge */}
        <div className="relative">
          <Link
            href={`/${userType}/message`}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[var(--border)]
              transition
              hover:border-[var(--primary)]
              relative
            "
          >
            <MessageCircle size={20} />
            {totalUnread > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  flex
                  h-5
                  min-w-[20px]
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  text-[10px]
                  font-bold
                  text-white
                  animate-pulse-dot
                  px-1
                  shadow-lg
                  shadow-red-500/30
                "
              >
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </Link>
        </div>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[var(--border)]
              transition
              hover:border-[var(--primary)]
            "
          >
            <Bell size={20} />
          </button>

          {showNotifications && (
            <div
              style={{ width: "300px", maxHeight: "300px" }}
              className="
                absolute
                right-0
                top-[calc(100%+12px)]
                z-50
                max-h-[600px]
                overflow-y-auto
                rounded-lg
                border
                border-[var(--border)]
                bg-[var(--background)]
                shadow-2xl
              "
            >
              <NotificationsDropdown />
            </div>
          )}
        </div>

        <div className="width-[200px]"></div>

        {/* Profile Avatar */}
        <Link
          href={`/${userType}/profile`}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-green-500
            text-white
            font-semibold
            transition
            hover:opacity-90
          "
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}