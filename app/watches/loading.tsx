export default function WatchesLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-72 animate-pulse rounded bg-[hsl(var(--muted))]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl bg-[hsl(var(--card))]" />
        ))}
      </div>
    </div>
  );
}
