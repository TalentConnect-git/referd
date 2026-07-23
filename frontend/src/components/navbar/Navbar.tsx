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
import { getInterviews, getUnreadInterviews } from "@/services/navbar.service";
import { Interview } from "@/types/navbar";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [unreadInterviewCount, setUnreadInterviewCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const { totalUnread, clearUnreadCount } = useGetAllUsers();
  const { 
    unreadCount: notificationUnreadCount, 
    markAllAsRead,
  } = useNotification();

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
  const profileImageUrl = profile?.profileImage || null;

  // ✅ Fetch unread interviews count for badge
  useEffect(() => {
    const fetchUnreadInterviews = async () => {
      try {
        const res = await getUnreadInterviews();
        setUnreadInterviewCount(res.data?.length || 0);
      } catch (err) {
        console.log("Error fetching unread interviews:", err);
      }
    };
    fetchUnreadInterviews();
  }, []);

  // ✅ Fetch interviews for calendar dropdown
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await getInterviews();
        const scheduled = res.data.filter(
          (interview: Interview) => interview.status === "Scheduled"
        );
        setUpcomingInterviews(scheduled);
      } catch (err) {
        console.log("Error fetching interviews:", err);
      }
    };
    fetchInterviews();
  }, []);

  // Refresh interviews when calendar is opened
  useEffect(() => {
    if (showCalendar) {
      const fetchInterviews = async () => {
        try {
          const res = await getInterviews();
          const scheduled = res.data.filter(
            (interview: Interview) => interview.status === "Scheduled"
          );
          setUpcomingInterviews(scheduled);
        } catch (err) {
          console.log("Error fetching interviews:", err);
        }
      };
      fetchInterviews();
    }
  }, [showCalendar]);

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

  const interviewCount = upcomingInterviews.length;

  const handleMessageClick = () => {
    router.push(`/${userType}/message`);
  };

  const handleNotificationClick = () => {
    if (notificationUnreadCount > 0) {
      markAllAsRead();
    }
    setShowNotifications((prev) => !prev);
  };

  // ✅ Handle calendar click - mark interviews as read
  const handleCalendarClick = () => {
    setShowCalendar((prev) => !prev);
    // Reset unread count when opening calendar
    if (unreadInterviewCount > 0) {
      setUnreadInterviewCount(0);
    }
  };

  // ✅ Function to close calendar modal
  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  // ✅ Function to close notifications modal
  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

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
        <div className="relative h-6 w-6 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
          <Image
            src={logo}
            alt="Referd Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <span className="text-sm font-medium tracking-tight text-white transition-colors duration-200 group-hover:text-[var(--primary)]">
          referd
          <span className="text-[var(--primary)]">.</span>
        </span>
      </Link>

      {/* Right side icons */}
      <div className="flex items-center gap-3">
        {/* ✅ Calendar with Interview Badge */}
        <div className="relative" ref={calendarRef}>
          <button
            onClick={handleCalendarClick}
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
            <CalendarDays size={15} className="text-[var(--text-secondary)]" />
            
            {/* ✅ Show unread interview count badge */}
            {unreadInterviewCount > 0 && (
              <span
                className="
                  absolute
                  -top-0.5
                  -right-0.5
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
                {unreadInterviewCount > 99 ? "99+" : unreadInterviewCount}
              </span>
            )}
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
              {/* ✅ Pass onClose prop to InterviewCall */}
              <InterviewCall onClose={handleCloseCalendar} />
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationClick}
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
            
            {notificationUnreadCount > 0 && (
              <span
                className="
                  absolute
                  -top-0.5
                  -right-0.5
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
                {notificationUnreadCount > 99 ? "99+" : notificationUnreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              style={{ width: "380px", maxHeight: "500px" }}
              className="
                absolute
                right-0
                top-[calc(100%+10px)]
                z-50
                overflow-y-auto
                rounded-lg
                border
                border-[var(--border)]
                bg-[var(--background)]
                shadow-2xl
              "
            >
              {/* ✅ Pass onClose prop to NotificationsDropdown */}
              <NotificationsDropdown onClick={handleCloseNotifications} />
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="relative">
          <button
            onClick={handleMessageClick}
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
              cursor-pointer
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
          </button>
        </div>

        {/* Profile */}
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