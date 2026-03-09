import Link from "next/link";
import { Watch, TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";
import { formatPrice, formatDate } from "@/lib/utils";
import Breadcrumbs from "@/components/Breadcrumbs";
import WatchCard from "@/components/WatchCard";
import ResalePerformanceChart from "@/components/ResalePerformanceChart";
import { getBrandLogoUrl, BRAND_LIST } from "@/lib/brands";
import { getDashboardData } from "@/lib/dashboard-data";
import { getWatchesFromDb } from "@/lib/watches";
import type { PerformanceItem } from "@/components/ResalePerformanceChart";
import Tooltip from "@/components/Tooltip";

function groupWatchesByBrand(watches: { id: string; brand: string; [key: string]: unknown }[]) {
  const byBrand: Record<string, typeof watches> = {};
  for (const w of watches ?? []) {
    const b = w.brand || "Other";
    if (!byBrand[b]) byBrand[b] = [];
    byBrand[b].push(w);
  }
  const ordered: { brand: string; watches: typeof watches }[] = [];
  for (const brand of BRAND_LIST) {
    if (byBrand[brand]?.length) ordered.push({ brand, watches: byBrand[brand] });
  }
  const rest = Object.keys(byBrand).filter((b) => !(BRAND_LIST as readonly string[]).includes(b));
  for (const b of rest) ordered.push({ brand: b, watches: byBrand[b] });
  return ordered;
}

export default async function DashboardPage() {
  const [data, watches] = await Promise.all([getDashboardData(), getWatchesFromDb()]);

  const totalWatches = data?.totalWatches ?? watches?.length ?? 0;
  const recentCount = data?.recentPrices?.length ?? 0;
  const best = data?.bestPerforming ?? [];
  const worst = data?.worstPerforming ?? [];
  const retailVsChrono = data?.retailVsChrono24 ?? [];
  const dataSource = data?.dataSource ?? "benchmark";
  const performanceMetric = data?.performanceMetric ?? "yoy";
  const firstPrice = data?.recentPrices?.[0] as { recordedAt?: string } | undefined;
  const asOf = firstPrice?.recordedAt != null ? formatDate(firstPrice.recordedAt) : null;

  const byBrand = groupWatchesByBrand(watches ?? []);

  const topForChart = best.slice(0, 12);
  const worstForChart = worst.slice(0, 12);

  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "How it works", href: "/" },
          { label: "Dashboard" },
        ]}
      />

      <header className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-6 shadow-sm sm:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-[hsl(var(--muted-foreground))]">
          Overview of watch availability, prices, resale value, and retailer vs Chrono24.
        </p>
        {asOf && (
          <p className="mt-2 text-sm font-medium text-[hsl(var(--muted-foreground))]">
            Data last updated: {asOf}
          </p>
        )}
        {dataSource === "real" && (
          <p className="mt-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-3 py-2 text-xs text-[hsl(var(--muted-foreground))]">
            Aftermarket: live Chrono24 data. Retail: benchmark from Rolex.com and official sites. Most in demand, Least in demand, and Retail vs Chrono24 show only models that have live data.
          </p>
        )}
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
            <Watch className="h-5 w-5" />
            <span className="text-sm font-medium">Models tracked</span>
          </div>
          <p className="mt-2 text-2xl font-semibold">{totalWatches}</p>
        </div>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Price updates</span>
          </div>
          <p className="mt-2 text-2xl font-semibold">{recentCount} recent</p>
        </div>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">Launches & events</span>
          </div>
          <p className="mt-2 text-2xl font-semibold">—</p>
        </div>
      </section>

      <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          Most in demand models
          {performanceMetric === "yoy" && (
            <Tooltip text="Year-over-year %: average price change from one year to the next. Positive = prices rising." />
          )}
          {performanceMetric === "premium" && (
            <Tooltip text="Chrono24 vs retail %: how much above (or below) benchmark retail the Chrono24 price trades." />
          )}
        </h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          {best.length > 0
            ? performanceMetric === "yoy"
              ? "Models that are increasing in price consistently (average year-over-year aftermarket change)."
              : "Models ranked by Chrono24 premium over retail (how far above or below benchmark retail they trade on Chrono24, as a percentage)."
            : "No data available for these models yet."}
          {dataSource === "real" && best.length > 0 && (
            <span className="mt-1 block">Watches with a <span className="inline-flex items-center rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-800">Live</span> badge use current Chrono24 data.</span>
          )}
        </p>
        {topForChart.length > 0 ? (
          <div className="mt-6">
            <ResalePerformanceChart
              data={topForChart as unknown as PerformanceItem[]}
              variant="best"
              metricLabel={performanceMetric === "yoy" ? "Avg YoY %" : "Chrono24 vs retail %"}
            />
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 p-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            No data yet. Run <code className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono">npm run db:seed</code> then <code className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono">npm run refresh-chrono24</code> (with RETAILED_API_KEY) for Chrono24 prices.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          Least in demand models
          {performanceMetric === "yoy" && (
            <Tooltip text="Year-over-year %: average price change. Negative = prices falling." />
          )}
          {performanceMetric === "premium" && (
            <Tooltip text="Chrono24 vs retail %: models trading below or with lowest premium over retail." />
          )}
        </h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          {worst.length > 0
            ? performanceMetric === "yoy"
              ? "Models that are decreasing in price or not increasing consistently (average year-over-year aftermarket change)."
              : "Models with the lowest Chrono24 premium over retail (or below retail)."
            : "No data available for these models yet."}
        </p>
        {worstForChart.length > 0 ? (
          <div className="mt-6">
            <ResalePerformanceChart
              data={worstForChart as unknown as PerformanceItem[]}
              variant="worst"
              metricLabel={performanceMetric === "yoy" ? "Avg YoY %" : "Chrono24 vs retail %"}
            />
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 p-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            No data yet. Run seed and refresh-chrono24 for Chrono24 data.
          </p>
        )}
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Most in demand
          </h2>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            Models that are increasing in price consistently.
          </p>
          {best.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {best.map((item) => {
                const watch = item.watch as { id: string; name: string; brand: string; reference?: string | null };
                return (
                <li key={watch.id}>
                  <Link
                    href={`/watches/${watch.id}`}
                    className="flex items-center gap-3 rounded-lg bg-[hsl(var(--muted))]/30 px-3 py-2.5 text-sm transition hover:bg-[hsl(var(--muted))]/50"
                  >
                    <img
                      src={getBrandLogoUrl(watch.brand)}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 shrink-0 rounded-md object-contain bg-white/80 p-0.5"
                      referrerPolicy="no-referrer"
                    />
                    <span className="min-w-0 flex-1 font-medium truncate">
                      {watch.name}
                      {watch.reference ? ` · ${watch.reference}` : ""}
                    </span>
                    {item.hasLiveData && (
                      <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-800">Live</span>
                    )}
                    <span className="shrink-0 text-emerald-500 font-medium">+{item.yoyPercent.toFixed(1)}% avg YoY</span>
                  </Link>
                </li>
              );
            })}
            </ul>
          ) : (
            <p className="mt-4 rounded-lg bg-[hsl(var(--muted))]/20 p-4 text-sm text-[hsl(var(--muted-foreground))]">
              Need at least two years of aftermarket data per watch to rank. Run the seed or add price history to see most in demand.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <TrendingDown className="h-5 w-5 text-red-400" />
            Least in demand
          </h2>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            Models that are decreasing or not increasing in price consistently.
          </p>
          {worst.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {worst.map((item) => {
                const watch = item.watch as { id: string; name: string; brand: string; reference?: string | null };
                return (
                <li key={watch.id}>
                  <Link
                    href={`/watches/${watch.id}`}
                    className="flex items-center gap-3 rounded-lg bg-[hsl(var(--muted))]/30 px-3 py-2.5 text-sm transition hover:bg-[hsl(var(--muted))]/50"
                  >
                    <img
                      src={getBrandLogoUrl(watch.brand)}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 shrink-0 rounded-md object-contain bg-white/80 p-0.5"
                      referrerPolicy="no-referrer"
                    />
                    <span className="min-w-0 flex-1 font-medium truncate">
                      {watch.name}
                      {watch.reference ? ` · ${watch.reference}` : ""}
                    </span>
                    {item.hasLiveData && (
                      <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-800">Live</span>
                    )}
                    <span className="shrink-0 text-red-400 font-medium">{item.yoyPercent.toFixed(1)}% avg YoY</span>
                  </Link>
                </li>
              );
            })}
            </ul>
          ) : (
            <p className="mt-4 rounded-lg bg-[hsl(var(--muted))]/20 p-4 text-sm text-[hsl(var(--muted-foreground))]">
              Need at least two years of aftermarket data to rank least in demand.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <BarChart3 className="h-5 w-5 text-[hsl(var(--accent))]" />
          Retail vs Chrono24
          <Tooltip text="Compares benchmark retail price to Chrono24 aftermarket. Green: trading above retail. Red: below retail." />
        </h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Cheapest at retailers vs aftermarket. Green = premium, red = below retail.
        </p>
        {retailVsChrono.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {retailVsChrono.map((item) => {
                const watch = item.watch as { id: string; name: string; brand: string };
                return (
                <li key={watch.id}>
                  <Link
                    href={`/watches/${watch.id}`}
                    className="flex flex-wrap items-center gap-3 rounded-lg bg-[hsl(var(--muted))]/30 px-3 py-2.5 text-sm transition hover:bg-[hsl(var(--muted))]/50"
                  >
                    <img
                      src={getBrandLogoUrl(watch.brand)}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 shrink-0 rounded-md object-contain bg-white/80 p-0.5"
                      referrerPolicy="no-referrer"
                    />
                    <span className="min-w-0 flex-1 font-medium truncate">{watch.name}</span>
                    {item.hasLiveData && (
                      <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-800">Live</span>
                    )}
                    <span className="text-[hsl(var(--muted-foreground))]">
                      Retail {formatPrice(item.retailPrice)} → Chrono24 {formatPrice(item.chrono24Price)}
                    </span>
                    <span
                      className={`shrink-0 font-medium ${item.premiumOrDiscountPercent >= 0 ? "text-emerald-500" : "text-red-400"}`}
                    >
                      {item.premiumOrDiscountPercent >= 0 ? "+" : ""}
                      {item.premiumOrDiscountPercent.toFixed(0)}%
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 rounded-lg bg-[hsl(var(--muted))]/20 p-4 text-sm text-[hsl(var(--muted-foreground))]">
            Add both retailer and aftermarket (Chrono24) price entries per watch to see comparison here.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">All watches by brand</h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Click a watch for full info, price history, YoY, and resale value.
        </p>

        {byBrand.length > 0 ? (
          <div className="mt-8 space-y-10">
            {byBrand.map(({ brand, watches: brandWatches }) => (
              <div key={brand}>
                <div className="mb-4 flex items-center gap-3 border-b border-[hsl(var(--border))] pb-3">
                  <img
                    src={getBrandLogoUrl(brand)}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-lg object-contain bg-[hsl(var(--muted))]/30 p-1.5"
                    referrerPolicy="no-referrer"
                  />
                  <h3 className="text-lg font-semibold">{brand}</h3>
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">
                    {brandWatches.length} model{brandWatches.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {brandWatches.map((w) => (
                    <li key={w.id}>
                      <WatchCard watch={w as { id: string; name: string; brand: string; reference: string | null; msrp: number | null; launchDate: string | null; imageUrl: string | null }} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 p-8 text-center text-[hsl(var(--muted-foreground))]">
            No watches yet. Run <code className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-sm">npm run db:seed</code> to load sample data.
          </p>
        )}
      </section>
    </div>
  );
}
