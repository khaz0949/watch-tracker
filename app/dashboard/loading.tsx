export default function DashboardLoading() {
  return (
    <div className="space-y-10">
      <div className="flex gap-2">
        <div className="h-5 w-24 animate-pulse rounded bg-[hsl(var(--muted))]" />
        <div className="h-5 w-20 animate-pulse rounded bg-[hsl(var(--muted))]" />
      </div>

      <header className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-6 shadow-sm sm:px-8">
        <div className="h-8 w-48 animate-pulse rounded bg-[hsl(var(--muted))]" />
        <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-[hsl(var(--muted))]" />
        <div className="mt-2 h-3 w-32 animate-pulse rounded bg-[hsl(var(--muted))]" />
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
            <div className="h-4 w-24 animate-pulse rounded bg-[hsl(var(--muted))]" />
            <div className="mt-3 h-8 w-16 animate-pulse rounded bg-[hsl(var(--muted))]" />
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <div className="h-6 w-48 animate-pulse rounded bg-[hsl(var(--muted))]" />
        <div className="mt-2 h-4 w-full max-w-md animate-pulse rounded bg-[hsl(var(--muted))]" />
        <div className="mt-6 h-64 animate-pulse rounded-lg bg-[hsl(var(--muted))]/50" />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
            <div className="h-5 w-36 animate-pulse rounded bg-[hsl(var(--muted))]" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-[hsl(var(--muted))]" />
            <div className="mt-4 space-y-2">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="h-12 animate-pulse rounded-lg bg-[hsl(var(--muted))]/50" />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded bg-[hsl(var(--muted))]" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-[hsl(var(--muted))]/50" />
          ))}
        </div>
      </section>
    </div>
  );
}
