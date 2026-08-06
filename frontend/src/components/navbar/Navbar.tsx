"use client";
import { Bell, CalendarDays, MessageCircle, Moon, Sun, X, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetAllUsers } from "@/hooks/useGetAllUsers";
import { useTheme } from "@/context/ThemeContext";
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

// Theme toggle component
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative flex h-8 w-8 items-center justify-center
        rounded-full bg-[var(--card)] text-[var(--text-secondary)]
        transition-colors hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]
      "
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
    </button>
  );
}

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
  const { unreadCount: notificationUnreadCount, markAllAsRead } =
    useNotification();

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

  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch unread interviews count for badge
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

  // Fetch interviews for calendar dropdown
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await getInterviews();
        const scheduled = res.data.filter(
          (interview: Interview) => interview.status === "Scheduled",
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
            (interview: Interview) => interview.status === "Scheduled",
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

  const handleCalendarClick = () => {
    setShowCalendar((prev) => !prev);
    if (unreadInterviewCount > 0) {
      setUnreadInterviewCount(0);
    }
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleLogoClick = () => {
    sessionStorage.setItem("fromLogo", "true");
    console.log("Logo clicked", sessionStorage.getItem("fromLogo"));
    router.push("/");
  };

  const handleBlogsClick = () => {
    router.push("/blogs");
  };

  return (
    <header
      className="
        global-navbar flex h-12 items-center
        justify-between border-b border-[var(--border)]
        bg-[var(--navbar-background)] px-3 sm:px-6
      "
    >
      {/* Logo */}
      <div
        onClick={handleLogoClick}
        className="group flex items-center gap-0.5 flex-shrink-0 cursor-pointer"
      >
        <div className="relative h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
          <Image
            src={logo}
            alt="Referd Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <span className="text-xs sm:text-sm font-medium tracking-tight text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary)]">
          referd
          <span className="text-[var(--primary)]">.</span>
        </span>
      </div>

      {/* Center - Empty for spacing */}

      {/* Right side icons */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Blogs - Mobile Icon */}
        <button
          onClick={handleBlogsClick}
          className="
            sm:hidden relative flex h-7 w-7 items-center justify-center
            rounded-full bg-[var(--card)] text-[var(--text-secondary)]
            transition-colors hover:bg-[var(--card-hover)] hover:text-[var(--primary)]
          "
          aria-label="Blogs"
        >
          <BookOpen size={13} />
        </button>

        {/* Blogs - Desktop Button (Before Theme Toggle) */}
        <button
          onClick={handleBlogsClick}
          className="
            hidden sm:flex items-center gap-1.5  py-1.5
              font-medium
            text-[var(--text-secondary)]
            hover:text-[var(--primary)]
            
            transition-all duration-200
          "
        >
          <BookOpen size={12} />
          <span className="text-[13px] font-medium " >Blogs</span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Calendar with Interview Badge */}
        <div className="relative" ref={calendarRef}>
          <button
            onClick={handleCalendarClick}
            className="
              relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center
              rounded-full bg-[var(--card)] text-[var(--text-secondary)]
              transition-colors hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]
            "
          >
            <CalendarDays size={13} className="sm:size-[15px]" />

            {unreadInterviewCount > 0 && (
              <span
                className="
                  absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4
                  min-w-[14px] sm:min-w-[16px] items-center justify-center
                  rounded-full bg-[var(--danger)] px-0.5 sm:px-1
                  text-[7px] sm:text-[9px] font-bold text-white
                  shadow-lg shadow-[var(--danger)]/30
                  animate-pulse-dot
                "
              >
                {unreadInterviewCount > 99 ? "99+" : unreadInterviewCount}
              </span>
            )}
          </button>

          {showCalendar && (
            <div
              className={`
                z-[9999]
                ${
                  isMobile
                    ? "fixed inset-0 flex items-start justify-center bg-black/20 backdrop-blur-sm px-4 pt-16"
                    : "absolute right-0 top-[calc(100%+10px)] w-[380px]"
                }
              `}
            >
              <div
                className={`
                  w-full
                  ${isMobile ? "max-w-md" : "w-[380px]"}
                  max-h-[80vh]
                  overflow-hidden
                  rounded-xl
                  border border-[var(--border)]
                  bg-[var(--background)]
                  shadow-2xl
                  relative
                `}
              >
                {/* Close button for mobile */}
                {isMobile && (
                  <button
                    onClick={handleCloseCalendar}
                    className="
                      absolute right-3 top-3 z-10
                      flex h-8 w-8 items-center justify-center
                      rounded-full bg-[var(--card-hover)] 
                      text-[var(--text-primary)]
                      transition-colors hover:bg-[var(--border)]
                    "
                  >
                    <X size={18} />
                  </button>
                )}
                <InterviewCall
                  onClose={handleCloseCalendar}
                  isMobile={isMobile}
                />
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationClick}
            className="
              relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center
              rounded-full bg-[var(--card)] text-[var(--text-secondary)]
              transition-colors hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]
            "
          >
            <Bell size={13} className="sm:size-[15px]" />

            {notificationUnreadCount > 0 && (
              <span
                className="
                  absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4
                  min-w-[14px] sm:min-w-[16px] items-center justify-center
                  rounded-full bg-[var(--danger)] px-0.5 sm:px-1
                  text-[7px] sm:text-[9px] font-bold text-white
                  shadow-lg shadow-[var(--danger)]/30
                  animate-pulse-dot
                "
              >
                {notificationUnreadCount > 99 ? "99+" : notificationUnreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className={`
                z-[9999]
                ${
                  isMobile
                    ? "fixed inset-0 flex items-start justify-center bg-black/20 backdrop-blur-sm px-4 pt-16"
                    : "absolute right-0 top-[calc(100%+10px)] w-[380px]"
                }
              `}
            >
              <div
                className={`
                  w-full
                  ${isMobile ? "max-w-md" : "w-[380px]"}
                  max-h-[80vh]
                  overflow-hidden
                  rounded-xl
                  border border-[var(--border)]
                  bg-[var(--background)]
                  shadow-2xl
                  relative
                `}
              >
                {/* Close button for mobile */}
                {isMobile && (
                  <button
                    onClick={handleCloseNotifications}
                    className="
                      absolute right-3 top-3 z-10
                      flex h-8 w-8 items-center justify-center
                      rounded-full bg-[var(--card-hover)] 
                      text-[var(--text-primary)]
                      transition-colors hover:bg-[var(--border)]
                    "
                  >
                    <X size={18} />
                  </button>
                )}
                <NotificationsDropdown onClick={handleCloseNotifications} />
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="relative">
          <button
            onClick={handleMessageClick}
            className="
              relative flex h-7 w-7 sm:h-8 sm:w-8 cursor-pointer items-center justify-center
              rounded-full bg-[var(--card)] text-[var(--text-secondary)]
              transition-colors hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]
            "
          >
            <MessageCircle size={13} className="sm:size-[15px]" />

            {totalUnread > 0 && (
              <span
                className="
                  absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4
                  min-w-[14px] sm:min-w-[16px] items-center justify-center
                  rounded-full bg-[var(--danger)] px-0.5 sm:px-1
                  text-[7px] sm:text-[9px] font-bold text-white
                  shadow-lg shadow-[var(--danger)]/30
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
            relative flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center
            justify-center overflow-hidden rounded-full
            bg-[var(--primary)] text-[10px] sm:text-xs font-semibold text-black
            transition hover:opacity-90
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