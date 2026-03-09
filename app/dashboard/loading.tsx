export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-64 animate-pulse rounded bg-[hsl(var(--muted))]" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-[hsl(var(--card))]" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl bg-[hsl(var(--card))]" />
        <div className="h-64 animate-pulse rounded-xl bg-[hsl(var(--card))]" />
      </div>
    </div>
  );
}
