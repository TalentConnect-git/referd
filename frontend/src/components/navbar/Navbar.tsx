"use client"
import { Bell,CalendarDays } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import NotificationsDropdown from "../notifications/NotificationsDropDown";
import InterviewCall from "./InterviewCall";

export default function Navbar() {

  const { profile, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendar,setShowCalendar]=useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);



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

//   useEffect(() => {
//   function handleClickOutside(event: MouseEvent) {
//     if (
//       dropdownRef.current &&
//       !dropdownRef.current.contains(event.target as Node)
//     ) {
//       setShowNotifications(false);
//     }
//   }

//   document.addEventListener("mousedown", handleClickOutside);

//   return () => {
//     document.removeEventListener(
//       "mousedown",
//       handleClickOutside
//     );
//   };
// }, []);
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


      {/* Notification Bell */}
      <div className="flex items-center gap-5">

        <div className="relative" ref={calendarRef}>
        <button
        onClick={()=>setShowCalendar(prev=>!prev)}
        className="flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[var(--border)]
                    hover:border-[var(--primary)]
                    ">
        <CalendarDays size={20}/>
        </button>
        {
          showCalendar &&
          <div
          style={{
          position: "absolute",
          top: "calc(100% + 12px)",
          right: 0,
          width: "420px",
          maxHeight: "500px",
          overflowY: "auto",
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          boxShadow: "0 20px 25px rgba(0,0,0,0.4)",
          zIndex: 9999,
        }}>
          <InterviewCall />
          </div>

          // <div className="
          //         absolute
          //         right-0
          //         top-[calc(100%+12px)]
          //         w-96
          //         max-h-[500px]
          //         overflow-y-auto
          //         rounded-lg
          //         border
          //         border-[var(--border)]
          //         bg-[var(--background)]
          //         shadow-2xl
          //         z-50">
          //         <InterviewCall/>
          //   </div>
          }

          </div>

        <div className="relative" ref={notificationRef} >
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
            hover:border-[var(--primary)]"
        >
          <Bell size={20} />
        </button>


        {showNotifications && (
            <div style={{width:"300px",maxHeight:"300px"}} className="
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
                ">
            
            <NotificationsDropdown />
        </div>)}
        </div>
            <div className="width-[200px]"></div>
            <Link href={`/${userType}/profile`}
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-green-500
                        text-white-500
                        font-semibold
                        transition
                        hover:opacity-90"
                        >
                    {initials}
                </Link>

        
      </div>
    </header>
  );
}



