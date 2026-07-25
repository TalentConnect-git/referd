import TestimonialCard from "@/components/ui/TestimonialCard";
import { RevealItem } from "@/components/ui/RevealSection";

const testimonials = [
  {
    quote:
      "Got my Razorpay referral within 48 hours of joining. Interviewed the same week.",
    name: "Aman Joshi",
    role: "Student · VIPS '25",
  },
  {
    quote:
      "I refer 3–5 candidates a month through Referd. The verification means I trust who I'm vouching for.",
    name: "Megha Rao",
    role: "Staff DS · Microsoft",
  },
  {
    quote:
      "Better than every job portal I've used. Feels like a serious product.",
    name: "Anjali Kapoor",
    role: "Engineer · Amazon",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Label */}
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.35em] text-[var(--primary)] sm:mb-5">
          Trusted
        </p>

        {/* Heading */}
        <h2 className="max-w-4xl text-3xl font-bold leading-tight tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl md:text-[42px]">
          Loved by students,
          <br />
          professionals, and hiring alumni.
        </h2>

        {/* Testimonials Grid */}
        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <RevealItem key={item.name} delay={index * 0.08}>
              <TestimonialCard
                quote={item.quote}
                name={item.name}
                role={item.role}
              />
            </RevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}