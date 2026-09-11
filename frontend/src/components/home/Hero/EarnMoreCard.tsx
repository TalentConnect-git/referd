import React from "react";
import { useAuth } from "@/context/AuthContext";

interface EarnMoreCardProps {
  onPostJob: () => void;
}

// Simple inline icons — kisi extra icon library ki dependency nahi
const BriefcaseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
    <path d="M3 12h18" />
    <path d="M10 12v2h4v-2" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const GiftIcon = () => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="8" width="18" height="13" rx="1.5" />
    <path d="M12 8v13" />
    <path d="M3 12h18" />
    <path d="M12 8H8.5a2.5 2.5 0 1 1 0-5C12 3 12 8 12 8Z" />
    <path d="M12 8h3.5a2.5 2.5 0 1 0 0-5C12 3 12 8 12 8Z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const EarnMoreCard: React.FC<EarnMoreCardProps> = ({ onPostJob }) => {
  const { role } = useAuth();

  const isProfessional = role === "professional";

  return (
    <div
      className="
        relative
        w-full
        max-w-[430px]
        min-h-[375px]
        overflow-hidden
        
        
        px-9
        py-8
       
        transition-all
        duration-[var(--transition-normal)]
        hover:border-[var(--primary-border)]
        hover:shadow-[var(--shadow-lg)]
      "
    >
      {/* Subtle glow - Dark mode uses primary with opacity, light mode uses soft primary */}
      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-24
          h-52
          w-52
         
          transition-all
          duration-[var(--transition-normal)]
        "
      />

      {/* ================= HEADER ================= */}
      <div className="relative z-10 mb-1">
        <h2
          className="
            text-[14px]
            font-bold
            tracking-[-0.2px]
            text-[var(--primary)]
          "
        >
          EARN MORE
        </h2>
      </div>

      {/* ================= MAIN TITLE ================= */}
      <div className="relative z-10">
        <h1
          className="
            text-[28px]
            font-bold
            leading-[1.08]
            tracking-[-0.8px]
            text-[var(--text-primary)]
          "
        >
          Earn{" "}
          <span className="text-[var(--primary)]">
            referral bonus
          </span>
          <br />
          from your company.
        </h1>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="relative z-10 mt-3">
        <p
          className="
            text-[13px]
            leading-[1.55]
            text-[var(--text-secondary)]
          "
        >
          Post referral jobs. Help the right people.
          <br />
          Earn the bonus. Grow your network.
        </p>
      </div>

      {/* ================= STEPS ================= */}
      <div
        className="
          relative
          z-10
          mt-5
          flex
          items-start
          justify-between
          gap-2
        "
      >
        {/* STEP 1 */}
        <div className="flex flex-1 flex-col items-center text-center min-w-[70px]">
          <div
            className="
              flex
              h-[47px]
              w-[47px]
              items-center
              justify-center
              rounded-full
              border
              border-[var(--primary-border)]
              bg-[var(--primary-soft)]
              text-[var(--primary)]
              shadow-[0_0_14px_var(--primary-soft)]
              transition-all
              duration-[var(--transition-normal)]
              group-hover:scale-105
            "
          >
            <BriefcaseIcon />
          </div>

          <p
            className="
              mt-3
              text-[11px]
              font-medium
              leading-[1.35]
              text-[var(--text-secondary)]
            "
          >
            Post referral jobs
          </p>

          <p
            className="
              mt-1
              text-[10px]
              leading-[1.3]
              text-[var(--text-muted)]
            "
          >
            from your company
          </p>
        </div>

        {/* CONNECTOR */}
        <div
          className="
            mt-[23px]
            h-px
            flex-1
            min-w-[10px]
            bg-gradient-to-r
            from-[var(--primary)]/20
            via-[var(--primary)]
            to-[var(--primary)]/20
          "
        />

        {/* STEP 2 */}
        <div className="flex flex-1 flex-col items-center text-center min-w-[70px]">
          <div
            className="
              flex
              h-[47px]
              w-[47px]
              items-center
              justify-center
              rounded-full
              border
              border-[var(--primary-border)]
              bg-[var(--primary-soft)]
              text-[var(--primary)]
              shadow-[0_0_14px_var(--primary-soft)]
              transition-all
              duration-[var(--transition-normal)]
              group-hover:scale-105
            "
          >
            <UsersIcon />
          </div>

          <p
            className="
              mt-3
              text-[11px]
              font-medium
              leading-[1.35]
              text-[var(--text-secondary)]
            "
          >
            Refer the right
            <br />
            candidate
          </p>

          <p
            className="
              mt-1
              text-[10px]
              leading-[1.3]
              text-[var(--text-muted)]
            "
          >
            Match the right talent
          </p>
        </div>

        {/* CONNECTOR */}
        <div
          className="
            mt-[23px]
            h-px
            flex-1
            min-w-[10px]
            bg-gradient-to-r
            from-[var(--primary)]/20
            via-[var(--primary)]
            to-[var(--primary)]/20
          "
        />

        {/* STEP 3 */}
        <div className="flex flex-1 flex-col items-center text-center min-w-[70px]">
          <div
            className="
              flex
              h-[47px]
              w-[47px]
              items-center
              justify-center
              rounded-full
              border
              border-[var(--primary-border)]
              bg-[var(--primary-soft)]
              text-[var(--primary)]
              shadow-[0_0_14px_var(--primary-soft)]
              transition-all
              duration-[var(--transition-normal)]
              group-hover:scale-105
            "
          >
            <GiftIcon />
          </div>

          <p
            className="
              mt-3
              text-[11px]
              font-medium
              leading-[1.35]
              text-[var(--text-secondary)]
            "
          >
            Earn your company's
            <br />
            referral bonus
          </p>

          <p
            className="
              mt-1
              text-[10px]
              leading-[1.3]
              text-[var(--text-muted)]
            "
          >
            Get rewarded
          </p>
        </div>
      </div>

      {/* ================= CTA ================= */}
      {isProfessional ? (
        <button
          type="button"
          onClick={onPostJob}
          className="
            relative
            z-10
            mt-7
            flex
            h-[41px]
            w-full
            items-center
            justify-center
            gap-2
            rounded-[10px]
            bg-[var(--primary)]
            text-[12px]
            font-semibold
            text-[var(--text-on-primary)]
            shadow-[0_4px_15px_var(--primary-soft)]
            transition-all
            duration-[var(--transition-fast)]
            hover:bg-[var(--primary-hover)]
            hover:shadow-[0_5px_20px_var(--primary-soft)]
            hover:scale-[1.02]
            active:scale-[0.98]
            focus-visible:ring-2
            focus-visible:ring-[var(--focus-ring)]
            focus-visible:ring-offset-2
          "
        >
          <span>Post a Referral Job</span>
          <ArrowRightIcon />
        </button>
      ) : (
        <div
          className="
            relative
            z-10
            mt-7
            rounded-[10px]
            border
            border-[var(--primary-border)]
            bg-[var(--primary-soft)]
            p-3
            text-center
            transition-all
            duration-[var(--transition-normal)]
          "
        >
          <p className="text-[12px] font-medium text-[var(--primary)]">
            🔒 Available for professionals only
          </p>

          <p className="mt-1 text-[10px] text-[var(--text-muted)]">
            Update your profile to access referral opportunities
          </p>
        </div>
      )}
    </div>
  );
};

export default EarnMoreCard;