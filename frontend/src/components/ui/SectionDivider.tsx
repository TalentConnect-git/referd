/**
 * A subtle center-fade hairline divider between sections.
 * Replaces hard border-t cuts — reads more premium.
 * 
 * @example
 * // Between sections
 * <Section />
 * <SectionDivider />
 * <NextSection />
 * 
 * // With custom className
 * <SectionDivider className="my-8" />
 */
export default function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(
            to right, 
            transparent, 
            var(--border) 30%, 
            var(--border) 70%, 
            transparent
          )`,
        }}
      />
    </div>
  );
}