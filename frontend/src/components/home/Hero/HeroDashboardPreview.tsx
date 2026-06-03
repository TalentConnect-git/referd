export default function HeroDashboardPreview() {
  return (
    <div className="relative mx-auto mt-10 w-full max-w-4xl scale-[0.86]">
      <div className="absolute -left-6 top-20 z-20 hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/90 px-3 py-2.5 shadow-2xl backdrop-blur-xl lg:block">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-medium text-[var(--primary)]">
            AS
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white">
              Ananya accepted
            </h4>
            <p className="text-[11px] text-[var(--text-primary)]">
              Referral to Google · 2m ago
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -right-3 -top-5 z-20 hidden rounded-full border border-[var(--border)] bg-[var(--card)]/90 px-3 py-2 text-xs font-medium text-white backdrop-blur-xl lg:block">
        <span className="mr-2 text-[var(--primary)]">▥</span>
        VIPS alumni hired at Amazon
      </div>

      <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--card)]/70 shadow-2xl backdrop-blur-xl">
        <div className="flex h-10 items-center border-b border-[var(--border)] px-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          </div>

          <p className="mx-auto font-mono text-[11px] text-[var(--text-primary)]">
            referd.app / dashboard
          </p>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[150px_1fr]">
          <aside className="hidden space-y-4 pt-2 text-[12px] text-[var(--text-primary)] lg:block">
            <p>Dashboard</p>

            <p className="rounded-lg bg-white/5 px-3 py-2 text-white">
              Applications
            </p>

            <p>Alumni Network</p>
            <p>Messages</p>
            <p>Activity</p>
          </aside>

          <main>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["REFERRAL REQUESTS", "14", "+3"],
                ["ALUMNI CONNECTIONS", "248", "+12"],
                ["MATCH SCORE", "92%", "High"],
              ].map((item) => (
                <div
                  key={item[0]}
                  className="rounded-xl border border-[var(--border)] bg-[var(--background-soft)]/70 p-3"
                >
                  <p className="font-mono text-[10px] tracking-wide text-[var(--text-primary)]">
                    {item[0]}
                  </p>

                  <h3 className="mt-3 text-[18px] font-bold text-white">
                    {item[1]}
                  </h3>

                  <p className="mt-1 font-mono text-[11px] text-[var(--primary)]">
                    {item[2]}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative mt-4 rounded-xl border border-[var(--border)] bg-[var(--background-soft)]/70 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[18px] font-semibold text-white">
                  Referral jobs for you
                </h3>

                <p className="font-mono text-[11px] text-[var(--text-primary)]">
                  3 new
                </p>
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
                  className="mb-2 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)]/70 p-2.5 last:mb-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[12px] font-bold text-white">
                      {job[0]}
                    </div>

                    <div>
                      <h4 className="text-[13px] font-semibold text-white">
                        {job[1]}
                      </h4>

                      <p className="text-[12px] text-[var(--text-primary)]">
                        {job[2]}
                      </p>
                    </div>
                  </div>

                  <div className="hidden items-center gap-2.5 sm:flex">
                    <span className="rounded-full bg-[var(--primary-soft)] px-2.5 py-1 font-mono text-[10px] text-[var(--primary)]">
                      {job[3]}
                    </span>

                    <span className="text-[12px] text-[var(--text-primary)]">
                      Apply →
                    </span>
                  </div>
                </div>
              ))}

              <div className="absolute -right-10 top-24 hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/90 p-3 shadow-2xl backdrop-blur-xl xl:block">
                <p className="mb-2 text-[13px] text-white">
                  Referral tracking
                </p>

                <div className="flex gap-1.5">
                  <span className="h-1.5 w-12 rounded bg-[var(--primary)]" />
                  <span className="h-1.5 w-12 rounded bg-[var(--primary)]" />
                  <span className="h-1.5 w-12 rounded bg-[var(--primary)]" />
                  <span className="h-1.5 w-12 rounded bg-slate-700" />
                </div>

                <div className="mt-2 flex justify-between gap-3 font-mono text-[10px] text-[var(--text-primary)]">
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