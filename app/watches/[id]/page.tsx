import { notFound } from "next/navigation";
import { formatPrice, formatDate, percentChange } from "@/lib/utils";

export const dynamic = "force-dynamic";
import PriceChart from "@/components/PriceChart";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getBrandLogoUrl } from "@/lib/brands";
import { getOfficialModelUrl } from "@/lib/official-model-urls";
import { getWatchFromDb } from "@/lib/watches";

function buildChartData(prices: { recordedAt: string; source: string; price: number }[]) {
  const byYear: Record<string, { retailer?: number; aftermarket?: number }> = {};
  for (const p of prices) {
    const year = p.recordedAt.slice(0, 4);
    if (!byYear[year]) byYear[year] = {};
    if (p.source === "retailer") byYear[year].retailer = p.price;
    else byYear[year].aftermarket = p.price;
  }
  return Object.entries(byYear)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, v]) => ({ year, ...v }));
}

export default async function WatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getWatchFromDb(id);
  if (!data?.watch) notFound();

  const { prices, events, hasLiveData } = data;
  const watch = data.watch as { id: string; name: string; brand: string; reference?: string | null; msrp?: number | null; launchDate?: string | null; imageUrl?: string | null };
  const chartData = buildChartData(prices || []);

  const aftermarketPrices = (prices || [])
    .filter((p: { source: string }) => p.source === "aftermarket")
    .sort(
      (a: { recordedAt: string }, b: { recordedAt: string }) =>
        b.recordedAt.localeCompare(a.recordedAt)
    );
  const latestPrice = aftermarketPrices[0]?.price;
  const prevPrice = aftermarketPrices[1]?.price;
  const yoyPercent =
    latestPrice != null && prevPrice != null
      ? percentChange(latestPrice, prevPrice)
      : null;

  const latestRetail = (prices || [])
    .filter((p: { source: string }) => p.source === "retailer")
    .sort(
      (a: { recordedAt: string }, b: { recordedAt: string }) =>
        b.recordedAt.localeCompare(a.recordedAt)
    )[0];

  const retailPrice = latestRetail?.price;
  const chrono24Price = latestPrice;
  const retailVsChronoPercent =
    retailPrice != null && chrono24Price != null
      ? percentChange(chrono24Price, retailPrice)
      : null;

  const logoUrl = getBrandLogoUrl(watch.brand);
  const officialUrl = getOfficialModelUrl(watch.brand, watch.reference ?? null, watch.name);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "How it works", href: "/" },
          { label: "Watches", href: "/watches" },
          { label: watch.name },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{watch.name}</h1>
          <p className="mt-1 flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
            <img
              src={logoUrl}
              alt=""
              width={20}
              height={20}
              className="rounded object-contain"
              referrerPolicy="no-referrer"
            />
            {watch.brand}
            {watch.reference ? ` · ${watch.reference}` : ""}
          </p>
          {hasLiveData !== true && (
            <p className="mt-1.5 text-xs italic text-[hsl(var(--muted-foreground))]">
              Data is indicative, not live.
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {watch.msrp != null && (
            <span className="rounded-lg bg-[hsl(var(--muted))] px-3 py-1.5">
              MSRP {formatPrice(watch.msrp)}
            </span>
          )}
          {watch.launchDate && (
            <span className="rounded-lg bg-[hsl(var(--muted))] px-3 py-1.5">
              Launch {watch.launchDate}
            </span>
          )}
          {officialUrl && (
            <Link
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
            >
              Verify at official site
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
      {officialUrl && (
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          MSRP and launch are from official or benchmark sources. Use the link above to verify on {watch.brand}&apos;s website.
        </p>
      )}

      {retailPrice != null && chrono24Price != null && (
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <h2 className="text-lg font-semibold">Retail vs Chrono24</h2>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            Official retailer price compared to aftermarket (Chrono24).
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg bg-[hsl(var(--muted))]/30 p-4">
            <div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Retail</p>
              <p className="text-xl font-semibold">{formatPrice(retailPrice)}</p>
            </div>
            <span className="text-[hsl(var(--muted-foreground))]">→</span>
            <div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Chrono24</p>
              <p className="text-xl font-semibold">{formatPrice(chrono24Price)}</p>
            </div>
            {retailVsChronoPercent != null && (
              <span
                className={
                  retailVsChronoPercent >= 0 ? "text-emerald-500" : "text-red-400"
                }
              >
                {retailVsChronoPercent >= 0 ? "+" : ""}
                {retailVsChronoPercent.toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Price history (YoY)</h2>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            Retail vs aftermarket over time. Hover for exact values.
          </p>
          {chartData.length > 0 ? (
            <div className="mt-4">
              <PriceChart data={chartData} />
            </div>
          ) : (
            <p className="mt-6 rounded-lg bg-[hsl(var(--muted))]/20 p-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
              No price history yet. Add retailer and aftermarket entries to see the chart.
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <h2 className="text-lg font-semibold">Resale value</h2>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Latest aftermarket
            </p>
            <p className="mt-2 text-2xl font-semibold text-[hsl(var(--accent))]">
              {latestPrice != null ? formatPrice(latestPrice) : "—"}
            </p>
            {yoyPercent != null && (
              <p
                className={`mt-1 text-sm ${yoyPercent >= 0 ? "text-emerald-500" : "text-red-400"}`}
              >
                {yoyPercent >= 0 ? "+" : ""}
                {yoyPercent.toFixed(1)}% YoY
              </p>
            )}
          </div>

          {latestRetail && (
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <h2 className="text-lg font-semibold">Retail</h2>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                {(latestRetail as { retailerName?: string }).retailerName || "Latest"}
              </p>
              <p className="mt-2 text-xl font-semibold">
                {formatPrice(latestRetail.price)}
              </p>
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                {formatDate(latestRetail.recordedAt)}
              </p>
            </div>
          )}

          {events && events.length > 0 && (
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <h2 className="text-lg font-semibold">Launches & events</h2>
              <ul className="mt-3 space-y-2">
                {events.map((e) => {
                  const ev = e as { id: string; eventType: string; date: string; note: string | null };
                  return (
                    <li key={ev.id} className="text-sm">
                      <span className="font-medium capitalize">{ev.eventType}</span>
                      <span className="text-[hsl(var(--muted-foreground))]">
                        {" "}
                        · {formatDate(ev.date)}
                      </span>
                      {ev.note && (
                        <p className="mt-0.5 text-[hsl(var(--muted-foreground))]">
                          {ev.note}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <h2 className="text-lg font-semibold">Recent price entries</h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Retailers and aftermarket (e.g. Chrono24).
        </p>
        {prices && prices.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {prices.slice(0, 10).map((p) => {
              const entry = p as { id: string; source: string; retailerName: string | null; price: number; recordedAt: string };
              return (
                <li
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[hsl(var(--muted))]/30 px-3 py-2 text-sm"
                >
                  <span className="capitalize">{entry.source}</span>
                  {entry.retailerName && (
                    <span className="text-[hsl(var(--muted-foreground))]">
                      {entry.retailerName}
                    </span>
                  )}
                  <span className="font-medium">{formatPrice(entry.price)}</span>
                  <span className="text-[hsl(var(--muted-foreground))]">
                    {formatDate(entry.recordedAt)}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 rounded-lg bg-[hsl(var(--muted))]/20 p-4 text-sm text-[hsl(var(--muted-foreground))]">
            No price entries yet. Add data via API or admin to see history here.
          </p>
        )}
      </div>
    </div>
  );
}
