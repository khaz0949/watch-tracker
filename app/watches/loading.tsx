export default function WatchesLoading() {
  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        <div className="h-5 w-24 animate-pulse rounded bg-[hsl(var(--muted))]" />
        <div className="h-5 w-20 animate-pulse rounded bg-[hsl(var(--muted))]" />
      </div>

      <header className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-6 shadow-sm sm:px-8">
        <div className="h-8 w-32 animate-pulse rounded bg-[hsl(var(--muted))]" />
        <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-[hsl(var(--muted))]" />
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-full max-w-xs animate-pulse rounded-lg bg-[hsl(var(--muted))]" />
        <div className="flex gap-2">
          <div className="h-10 w-28 animate-pulse rounded-lg bg-[hsl(var(--muted))]" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-[hsl(var(--muted))]" />
        </div>
      </div>

      <div className="space-y-10">
        {[1, 2, 3].map((section) => (
          <section key={section}>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-[hsl(var(--muted))]" />
              <div className="h-5 w-24 animate-pulse rounded bg-[hsl(var(--muted))]" />
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <li key={i} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
                  <div className="flex gap-3">
                    <div className="h-20 w-20 shrink-0 animate-pulse rounded-lg bg-[hsl(var(--muted))]" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-[hsl(var(--muted))]" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-[hsl(var(--muted))]" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-[hsl(var(--muted))]" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
