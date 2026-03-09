/**
 * Shared dashboard data logic — used by the API route and the home page
 * so the home page gets data directly from the DB (no self-fetch).
 */
import { getDb } from "@/lib/db";
import { watches, priceEntries } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function getWatchId(p: Record<string, unknown>): string {
  return (p.watchId as string) ?? (p.watch_id as string) ?? "";
}
function getRecordedAt(p: Record<string, unknown>): string {
  return (p.recordedAt as string) ?? (p.recorded_at as string) ?? "";
}
function getSource(p: Record<string, unknown>): string {
  return (p.source as string) ?? "";
}
function getPrice(p: Record<string, unknown>): number {
  const raw = (p.price ?? (p as Record<string, unknown>).price);
  if (typeof raw === "number" && !Number.isNaN(raw)) return raw;
  if (typeof raw === "string") return parseInt(raw, 10) || 0;
  return 0;
}
function getRetailerName(p: Record<string, unknown>): string | null {
  return (p.retailerName as string) ?? (p.retailer_name as string) ?? null;
}

function isLiveAftermarket(p: Record<string, unknown>): boolean {
  const name = getRetailerName(p);
  return !!(name?.includes("Chrono24 (live)") || name?.includes("TheWatchAPI"));
}

export type DashboardData = {
  totalWatches: number;
  bestPerforming: { watch: Record<string, unknown>; yoyPercent: number; latestPrice: number; hasLiveData: boolean }[];
  worstPerforming: { watch: Record<string, unknown>; yoyPercent: number; latestPrice: number; hasLiveData: boolean }[];
  retailVsChrono24: { watch: Record<string, unknown>; retailPrice: number; chrono24Price: number; premiumOrDiscountPercent: number; hasLiveData: boolean }[];
  dataSource: "real" | "benchmark";
  performanceMetric: "yoy" | "premium";
  recentPrices: unknown[];
};

export async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const db = getDb();
    const allWatches = await db.select().from(watches).orderBy(desc(watches.updatedAt));
    const allPrices = await db.select().from(priceEntries).orderBy(desc(priceEntries.recordedAt));
    const totalWatches = allWatches.length;

    const aftermarketByWatch = new Map<
      string,
      { prices: { year: string; price: number }[]; hasLiveYear: Set<string> }
    >();
    const watchIdsWithLiveAftermarket = new Set<string>();

    for (const p of allPrices as unknown as Record<string, unknown>[]) {
      if (getSource(p) !== "aftermarket" || !isLiveAftermarket(p)) continue;
      const recordedAt = getRecordedAt(p);
      if (!recordedAt) continue;
      const year = recordedAt.slice(0, 4);
      const watchId = getWatchId(p);
      if (!watchId) continue;
      watchIdsWithLiveAftermarket.add(watchId);
      if (!aftermarketByWatch.has(watchId)) {
        aftermarketByWatch.set(watchId, { prices: [], hasLiveYear: new Set() });
      }
      const entry = aftermarketByWatch.get(watchId)!;
      if (!entry.prices.some((x) => x.year === year)) {
        entry.prices.push({ year, price: getPrice(p) });
        entry.hasLiveYear.add(year);
      }
    }
    for (const p of allPrices as unknown as Record<string, unknown>[]) {
      if (getSource(p) !== "aftermarket" || isLiveAftermarket(p)) continue;
      const recordedAt = getRecordedAt(p);
      if (!recordedAt) continue;
      const year = recordedAt.slice(0, 4);
      const watchId = getWatchId(p);
      if (!watchId) continue;
      if (!aftermarketByWatch.has(watchId)) {
        aftermarketByWatch.set(watchId, { prices: [], hasLiveYear: new Set() });
      }
      const entry = aftermarketByWatch.get(watchId)!;
      if (!entry.prices.some((x) => x.year === year)) {
        entry.prices.push({ year, price: getPrice(p) });
      }
    }

    const performance: { watchId: string; yoy: number; latestPrice: number }[] = [];
    for (const w of allWatches) {
      const data = aftermarketByWatch.get(w.id);
      if (!data?.prices.length) continue;
      data.prices.sort((a, b) => b.year.localeCompare(a.year));
      const yoyChanges: number[] = [];
      for (let i = 0; i < data.prices.length - 1; i++) {
        const current = data.prices[i].price;
        const previous = data.prices[i + 1].price;
        yoyChanges.push(percentChange(current, previous));
      }
      if (yoyChanges.length === 0) continue;
      const avgYoy = yoyChanges.reduce((a, b) => a + b, 0) / yoyChanges.length;
      const latest = data.prices[0];
      performance.push({ watchId: w.id, yoy: avgYoy, latestPrice: latest.price });
    }
    performance.sort((a, b) => b.yoy - a.yoy);

    const retailByWatch = new Map<string, number>();
    const chronoByWatch = new Map<string, number>();
    const chronoIsLive = new Set<string>();
    for (const p of allPrices as unknown as Record<string, unknown>[]) {
      const watchId = getWatchId(p);
      if (!watchId) continue;
      const src = getSource(p);
      if (src === "retailer") {
        if (!retailByWatch.has(watchId)) retailByWatch.set(watchId, getPrice(p));
      } else if (src === "aftermarket") {
        const isLive = isLiveAftermarket(p);
        if (isLive) {
          chronoByWatch.set(watchId, getPrice(p));
          chronoIsLive.add(watchId);
        } else if (!chronoByWatch.has(watchId)) {
          chronoByWatch.set(watchId, getPrice(p));
        }
      }
    }
    const retailVsChrono24 = allWatches
      .filter((w) => retailByWatch.has(w.id) && chronoByWatch.has(w.id))
      .map((w) => {
        const retail = retailByWatch.get(w.id)!;
        const chrono = chronoByWatch.get(w.id)!;
        const diffPercent = percentChange(chrono, retail);
        return {
          watch: w as unknown as Record<string, unknown>,
          retailPrice: retail,
          chrono24Price: chrono,
          premiumOrDiscountPercent: diffPercent,
          hasLiveData: chronoIsLive.has(w.id),
        };
      })
      .sort((a, b) => a.retailPrice - b.retailPrice)
      .slice(0, 15);

    type PerfItem = { watch: Record<string, unknown>; yoyPercent: number; latestPrice: number; hasLiveData: boolean };
    let bestPerforming: PerfItem[];
    let worstPerforming: PerfItem[];
    let performanceMetric: "yoy" | "premium" = "yoy";

    if (performance.length > 0) {
      bestPerforming = performance.slice(0, 12).map((p) => {
        const watch = allWatches.find((w) => w.id === p.watchId)!;
        return { watch: watch as unknown as Record<string, unknown>, yoyPercent: p.yoy, latestPrice: p.latestPrice, hasLiveData: watchIdsWithLiveAftermarket.has(p.watchId) };
      });
      worstPerforming = [...performance]
        .sort((a, b) => a.yoy - b.yoy)
        .slice(0, 12)
        .map((p) => {
          const watch = allWatches.find((w) => w.id === p.watchId)!;
          return { watch: watch as unknown as Record<string, unknown>, yoyPercent: p.yoy, latestPrice: p.latestPrice, hasLiveData: watchIdsWithLiveAftermarket.has(p.watchId) };
        });
    } else {
      performanceMetric = "premium";
      const byPremium = [...retailVsChrono24].sort(
        (a, b) => b.premiumOrDiscountPercent - a.premiumOrDiscountPercent
      );
      bestPerforming = byPremium.slice(0, 12).map((r) => ({
        watch: r.watch,
        yoyPercent: r.premiumOrDiscountPercent,
        latestPrice: r.chrono24Price,
        hasLiveData: chronoIsLive.has((r.watch as { id: string }).id),
      }));
      worstPerforming = byPremium.slice(-12).reverse().map((r) => ({
        watch: r.watch,
        yoyPercent: r.premiumOrDiscountPercent,
        latestPrice: r.chrono24Price,
        hasLiveData: chronoIsLive.has((r.watch as { id: string }).id),
      }));
    }

    const dataSource = (allPrices as unknown as Record<string, unknown>[]).some((p) => {
      const name = getRetailerName(p);
      return name?.includes("TheWatchAPI") || name?.includes("Chrono24 (live)") || false;
    })
      ? "real"
      : "benchmark";

    return {
      totalWatches,
      bestPerforming,
      worstPerforming,
      retailVsChrono24,
      dataSource,
      performanceMetric,
      recentPrices: allPrices.slice(0, 20),
    };
  } catch (e) {
    console.error("[dashboard-data] Error:", e);
    return null;
  }
}
