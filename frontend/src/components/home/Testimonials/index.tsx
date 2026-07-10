import TestimonialCard from "@/components/ui/TestimonialCard";

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
    <section
      className="bg-[var(--background)] px-6 py-16 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-5 font-mono text-[12px] font-semibold uppercase tracking-[0.35em] text-[var(--primary)]">
          Trusted
        </p>

        <h2 className="max-w-4xl text-[34px] font-bold leading-tight tracking-[-0.04em] text-white md:text-[42px]">
          Loved by students,
          <br />
          professionals, and hiring alumni.
        </h2>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <TestimonialCard
              key={item.name}
              quote={item.quote}
              name={item.name}
              role={item.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
}