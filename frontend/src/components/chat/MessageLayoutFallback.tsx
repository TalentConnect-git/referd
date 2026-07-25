export default function MessageLayoutFallback() {
  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{ background: "var(--background)" }}
    >
      <div className="text-center text-primary">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted">Loading messages...</p>
      </div>
    </div>
  );
}