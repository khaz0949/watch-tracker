import Breadcrumbs from "@/components/Breadcrumbs";
import WatchesList from "@/components/WatchesList";
import { getWatchesFromDb } from "@/lib/watches";

export const dynamic = "force-dynamic";

export default async function WatchesListPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}) {
  const watches = await getWatchesFromDb();
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
