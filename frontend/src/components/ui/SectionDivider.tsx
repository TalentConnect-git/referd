/**
 * A subtle center-fade hairline divider between sections.
 * Replaces hard border-t cuts — reads more premium.
 */
export default function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10"
    >
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(148,163,184,0.18) 30%, rgba(148,163,184,0.18) 70%, transparent)",
        }}
      />
    </div>
  );
}
