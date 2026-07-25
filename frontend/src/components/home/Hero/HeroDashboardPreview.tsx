export default function HeroDashboardPreview() {
  return (
    <div className="relative mx-auto mt-8 w-full max-w-4xl scale-[0.9] sm:mt-10 sm:scale-[0.92] lg:scale-[0.86]">
      {/* Floating Notification - Left */}
      <div className="absolute -left-4 top-16 z-20 hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/90 px-3 py-2.5 shadow-lg backdrop-blur-xl lg:-left-6 lg:top-20 lg:block">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-medium text-[var(--primary)]">
            AS
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
              Ananya accepted
            </h4>
            <p className="text-[11px] text-[var(--text-muted)]">
              Referral to Google · 2m ago
            </p>
          </div>
        </div>
      </div>

      {/* Floating Badge - Right */}
      <div className="absolute -right-2 -top-4 z-20 hidden rounded-full border border-[var(--border)] bg-[var(--card)]/90 px-3 py-2 text-xs font-medium text-[var(--text-primary)] backdrop-blur-xl lg:-right-3 lg:-top-5 lg:block">
        <span className="mr-2 text-[var(--primary)]">▥</span>
        VIPS alumni hired at Amazon
      </div>

      {/* Main Dashboard Card */}
      <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--card)]/80 shadow-xl backdrop-blur-xl">
        {/* Browser Chrome */}
        <div className="flex h-10 items-center border-b border-[var(--border)] px-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--text-muted)]/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--text-muted)]/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--text-muted)]/30" />
          </div>

          <p className="mx-auto font-mono text-[11px] text-[var(--text-muted)]">
            referd.app / dashboard
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="grid gap-4 p-4 lg:grid-cols-[150px_1fr]">
          {/* Sidebar */}
          <aside className="hidden space-y-4 pt-2 text-xs text-[var(--text-secondary)] lg:block">
            <p className="font-medium">Dashboard</p>

            <p className="rounded-lg bg-[var(--sidebar-active)] px-3 py-2 text-[var(--primary)] font-medium">
              Applications
            </p>

            <p className="transition-colors hover:text-[var(--text-primary)] cursor-default">Alumni Network</p>
            <p className="transition-colors hover:text-[var(--text-primary)] cursor-default">Messages</p>
            <p className="transition-colors hover:text-[var(--text-primary)] cursor-default">Activity</p>
          </aside>

          {/* Main Content */}
          <main>
            {/* Stats Cards */}
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {[
                ["REFERRAL REQUESTS", "14", "+3"],
                ["ALUMNI CONNECTIONS", "248", "+12"],
                ["MATCH SCORE", "92%", "High"],
              ].map((item) => (
                <div
                  key={item[0]}
                  className="rounded-xl border border-[var(--border)] bg-[var(--background-soft)]/70 p-3"
                >
                  <p className="font-mono text-[10px] tracking-wide text-[var(--text-muted)]">
                    {item[0]}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-[var(--text-primary)] sm:mt-3 sm:text-[18px]">
                    {item[1]}
                  </h3>

                  <p className="mt-1 font-mono text-[11px] text-[var(--primary)]">
                    {item[2]}
                  </p>
                </div>
              ))}
            </div>

            {/* Job Listings */}
            <div className="relative mt-4 rounded-xl border border-[var(--border)] bg-[var(--background-soft)]/70 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] sm:text-[18px]">
                  Referral jobs for you
                </h3>
              </div>

              {[
                [
                  "G",
                  "Software Engineer",
                  "Google · referred by Ananya · VIPS '21",
                  "94% match",
                ],
                [
                  "S",
                  "Product Manager",
                  "Stripe · referred by Rohit · IIT Delhi '19",
                  "91% match",
                ],
                [
                  "L",
                  "Design Engineer",
                  "Linear · referred by Kabir · NID '20",
                  "90% match",
                ],
              ].map((job) => (
                <div
                  key={job[1]}
                  className="mb-2 flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)]/70 p-2.5 last:mb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--background-soft)] text-xs font-bold text-[var(--text-primary)]">
                      {job[0]}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                        {job[1]}
                      </h4>

                      <p className="text-xs text-[var(--text-muted)]">
                        {job[2]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2.5 sm:justify-end">
                    <span className="rounded-full bg-[var(--primary-soft)] px-2.5 py-1 font-mono text-[10px] text-[var(--primary)]">
                      {job[3]}
                    </span>

                    <span className="text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--primary)] cursor-default">
                      Apply →
                    </span>
                  </div>
                </div>
              ))}

              {/* Floating Progress Indicator */}
              <div className="absolute -right-8 top-20 hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/90 p-3 shadow-lg backdrop-blur-xl xl:right-auto xl:-right-10 xl:block">
                <p className="mb-2 text-sm text-[var(--text-primary)]">
                  Referral tracking
                </p>

                <div className="flex gap-1.5">
                  <span className="h-1.5 w-12 rounded bg-[var(--primary)]" />
                  <span className="h-1.5 w-12 rounded bg-[var(--primary)]" />
                  <span className="h-1.5 w-12 rounded bg-[var(--primary)]" />
                  <span className="h-1.5 w-12 rounded bg-[var(--text-muted)]/20" />
                </div>

                <div className="mt-2 flex justify-between gap-3 font-mono text-[10px] text-[var(--text-muted)]">
                  <span>Applied</span>
                  <span>Referral</span>
                  <span>Review</span>
                  <span>Interview</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}