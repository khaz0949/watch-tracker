"use client";

import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import WatchCard from "./WatchCard";
import { BRAND_LIST, getBrandLogoUrl } from "@/lib/brands";

type Watch = {
  id: string;
  name: string;
  brand: string;
  reference: string | null;
  msrp: number | null;
  launchDate: string | null;
  imageUrl: string | null;
  hasLiveData?: boolean;
};

export default function WatchesList({
  watches,
  initialBrand = "",
}: {
  watches: Watch[];
  initialBrand?: string;
}) {
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>(initialBrand);

  useEffect(() => {
    setBrandFilter(initialBrand);
  }, [initialBrand]);
  const [sort, setSort] = useState<"name" | "brand" | "msrp">("brand");
  const [groupByBrand, setGroupByBrand] = useState(true);

  const filtered = useMemo(() => {
    let list = watches;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.brand.toLowerCase().includes(q) ||
          (w.reference && w.reference.toLowerCase().includes(q))
      );
    }
    if (brandFilter) {
      list = list.filter((w) => w.brand === brandFilter);
    }
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "brand") list = [...list].sort((a, b) => a.brand.localeCompare(b.brand));
    if (sort === "msrp") list = [...list].sort((a, b) => (a.msrp ?? 0) - (b.msrp ?? 0));
    return list;
  }, [watches, search, brandFilter, sort]);

  const byBrand = useMemo(() => {
    if (!groupByBrand) return null;
    const map = new Map<string, Watch[]>();
    for (const w of filtered) {
      const arr = map.get(w.brand) ?? [];
      arr.push(w);
      map.set(w.brand, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered, groupByBrand]);

  if (watches.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 p-12 text-center">
        <p className="text-[hsl(var(--muted-foreground))]">No watches in the database yet.</p>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Run <code className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono">npm run db:seed</code> to load sample data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            type="search"
            placeholder="Search watches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2 pl-9 pr-3 text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--accent))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--accent))]"
            aria-label="Search watches"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm focus:border-[hsl(var(--accent))] focus:outline-none"
            aria-label="Filter by brand"
          >
            <option value="">All brands</option>
            {BRAND_LIST.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "name" | "brand" | "msrp")}
            className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm focus:border-[hsl(var(--accent))] focus:outline-none"
            aria-label="Sort by"
          >
            <option value="brand">Sort by brand</option>
            <option value="name">Sort by name</option>
            <option value="msrp">Sort by MSRP</option>
          </select>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <input
              type="checkbox"
              checked={groupByBrand}
              onChange={(e) => setGroupByBrand(e.target.checked)}
              className="rounded border-[hsl(var(--border))] text-[hsl(var(--accent))] focus:ring-[hsl(var(--accent))]"
            />
            Group by brand
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 p-8 text-center text-[hsl(var(--muted-foreground))]">
          No watches match your filters. Try a different search or brand.
        </p>
      ) : groupByBrand && byBrand ? (
        <div className="space-y-10">
          {byBrand.map(([brand, list]) => (
            <section key={brand}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-[hsl(var(--muted))] p-1">
                  <img
                    src={getBrandLogoUrl(brand)}
                    alt=""
                    className="h-full w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h2 className="text-lg font-semibold">{brand}</h2>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((w) => (
                  <li key={w.id}>
                    <WatchCard watch={w} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w) => (
            <li key={w.id}>
              <WatchCard watch={w} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
