export default function WatchDetailLoading() {
  return (
    <div className="space-y-8">
      <div className="h-5 w-48 animate-pulse rounded bg-[hsl(var(--muted))]" />
      <div className="aspect-[3/1] animate-pulse rounded-xl bg-[hsl(var(--card))]" />
      <div className="h-10 w-72 animate-pulse rounded bg-[hsl(var(--muted))]" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-xl bg-[hsl(var(--card))] lg:col-span-2" />
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-xl bg-[hsl(var(--card))]" />
          <div className="h-28 animate-pulse rounded-xl bg-[hsl(var(--card))]" />
        </div>
      </div>
    </div>
  );
}
