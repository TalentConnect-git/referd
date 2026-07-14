"use client";
import { Bell, CalendarDays, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetAllUsers } from "@/hooks/useGetAllUsers";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import NotificationsDropdown from "../notifications/NotificationsDropDown";
import InterviewCall from "./InterviewCall";
import logo from "@/assets/icon.png";
import { useNotification } from "@/context/NotificationContext";

export default function Navbar() {
  const { profile, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const { totalUnread } = useGetAllUsers();
  const { unreadCount: notificationUnreadCount } = useNotification();

  const displayName =
    profile?.fullName || profile?.name || user?.name || "User";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const userType = profile?.profileType || user?.userType || "student";

  // Use profile.profileImage directly
  const profileImageUrl = profile?.profileImage || null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }

      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className="
        mb-0
        flex
        h-12
        items-center
        justify-between
        border-b
        border-[#2a3a52]
        bg-[var(--background)]
        px-6
      "
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-0.5 group">
        {/* Logo Image */}
        <div className="relative h-6 w-6 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
          <Image
            src={logo}
            alt="Referd Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Text with dot */}
        <span className="text-sm font-medium tracking-tight text-white transition-colors duration-200 group-hover:text-[var(--primary)]">
          referd
          <span className="text-[var(--primary)]">.</span>
        </span>
      </Link>

      {/* Right side icons */}
      <div className="flex items-center gap-3">
        {/* Calendar */}
        <div className="relative" ref={calendarRef}>
          <button
            onClick={() => setShowCalendar((prev) => !prev)}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-[var(--card-bg)]
              hover:bg-[var(--primary-hover)]
              transition-colors
            "
          >
            <CalendarDays size={15} className="text-[var(--text-secondary)]" />
          </button>
          {showCalendar && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: "380px",
                maxHeight: "450px",
                overflowY: "auto",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                boxShadow: "0 20px 25px rgba(0,0,0,0.4)",
                zIndex: 9999,
              }}
            >
              <InterviewCall />
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="
              relative
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-[var(--card-bg)]
              hover:bg-[var(--primary-hover)]
              transition-colors
            "
          >
            <Bell size={15} className="text-[var(--text-secondary)]" />
            
            {/* Notification Badge - Dot */}
            {notificationUnreadCount > 0 && (
              <span
                className="
                  absolute
                  -top-0.5
                  -right-0.5
                  flex
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-red-500
                  border-2
                  border-[var(--background)]
                  shadow-lg
                  shadow-red-500/30
                  animate-pulse-dot
                "
              />
            )}
          </button>

          {showNotifications && (
            <div
              style={{ width: "280px", maxHeight: "300px" }}
              className="
                absolute
                right-0
                top-[calc(100%+10px)]
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

        {/* Messages */}
        <div className="relative">
          <Link
            href={`/${userType}/message`}
            className="
              relative
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-[var(--card-bg)]
              hover:bg-[var(--primary-hover)]
              transition-colors
            "
          >
            <MessageCircle size={15} className="text-[var(--text-secondary)]" />

            {totalUnread > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  flex
                  h-4
                  min-w-[16px]
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[9px]
                  font-bold
                  text-white
                  shadow-lg
                  shadow-red-500/30
                  animate-pulse-dot
                "
              >
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </Link>
        </div>

        {/* Profile - using profile.profileImage */}
        <Link
          href={`/${userType}/profile`}
          className="
            relative
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            overflow-hidden
            bg-[var(--primary)]
            text-white
            font-semibold
            text-xs
            transition
            hover:opacity-90
            flex-shrink-0
          "
        >
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={displayName}
              width={20}
              height={20}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <span>{initials}</span>
          )}
        </Link>
      </div>
    </header>
  );
}