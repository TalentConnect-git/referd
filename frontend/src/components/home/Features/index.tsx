import { Briefcase, ShieldCheck, Users } from "lucide-react";
import FeatureCard from "@/components/ui/FeatureCard";

export default function Features() {
  return (
    <section
      id="product"
      className="bg-[var(--background)] px-6 py-24 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-7 font-light text-[14px] font-semibold uppercase tracking-[0.35em] text-[var(--primary)]">
          The Platform
        </p>

        <h2 className="max-w-4xl text-[34px] font-bold leading-tight tracking-[-0.04em] text-white md:text-[43px]">
          What exactly is Referd?
        </h2>

        <p className="mt-6 text-[16px] font-mono leading-8 text-[var(--text-primary)]">
          A focused network for one thing: turning your school's alumni into
          actual job offers.
        </p>

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          <FeatureCard
            icon={<Users size={30} />}
            title="Alumni Network"
            description="Find alumni from your college working at the companies you want to join."
            footerText="12,400+ verified alumni"
          />

          <FeatureCard
            icon={<Briefcase size={30} />}
            title="Referral Jobs"
            description="Discover real roles posted by employees willing to refer."
            footerText="Updated daily"
          />

          <FeatureCard
            icon={<ShieldCheck size={30} />}
            title="Trusted Referrals"
            description="Request referrals from verified seniors — vouched, not cold."
            footerText="84% acceptance rate"
          />
        </div>
      </div>
    </section>
  );
}