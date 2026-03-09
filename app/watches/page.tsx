import Breadcrumbs from "@/components/Breadcrumbs";
import WatchesList from "@/components/WatchesList";

export const dynamic = "force-dynamic";

async function getWatches() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/watches`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function WatchesListPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}) {
  const watches = await getWatches();
  const params = await searchParams;
  const initialBrand = params?.brand ?? "";

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "How it works", href: "/" }, { label: "Watches" }]} />
      <header className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-6 shadow-sm sm:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Watches</h1>
        <p className="mt-1 text-[hsl(var(--muted-foreground))]">
          All tracked models — retail and aftermarket prices, availability, launches. Filter by brand or search.
        </p>
      </header>
      <WatchesList watches={watches || []} initialBrand={initialBrand} />
    </div>
  );
}
