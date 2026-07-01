export default function MessageLayoutFallback() {
  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{ background: "var(--background)" }}
    >
      <div className="text-center text-white">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
        <p className="text-[var(--text-muted)]">Loading messages...</p>
      </div>
    </div>
  );
}