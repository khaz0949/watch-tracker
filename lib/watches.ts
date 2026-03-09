import { getDb } from "@/lib/db";
import { watches, priceEntries, launchEvents } from "@/lib/db/schema";
import { desc, eq, or, like, and, isNotNull } from "drizzle-orm";

export type WatchWithLive = {
  id: string;
  name: string;
  brand: string;
  reference: string | null;
  launchDate: string | null;
  msrp: number | null;
  currency: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  hasLiveData: boolean;
};

export async function getWatchesFromDb(): Promise<WatchWithLive[]> {
  try {
    const db = getDb();
    const list = await db.select().from(watches).orderBy(desc(watches.updatedAt));

    const liveRows = await db
      .selectDistinct({ watchId: priceEntries.watchId })
      .from(priceEntries)
      .where(
        and(
          eq(priceEntries.source, "aftermarket"),
          isNotNull(priceEntries.retailerName),
          or(
            like(priceEntries.retailerName, "%Chrono24 (live)%"),
            like(priceEntries.retailerName, "%TheWatchAPI%")
          )
        )
      );
    const liveIds = new Set(liveRows.map((r) => r.watchId));

    return list.map((w) => ({
      ...w,
      hasLiveData: liveIds.has(w.id),
    }));
  } catch (e) {
    console.error("[watches] Error:", e);
    return [];
  }
}

export type WatchDetail = {
  watch: Record<string, unknown>;
  prices: { recordedAt: string; source: string; price: number; [key: string]: unknown }[];
  events: { date: string; [key: string]: unknown }[];
  hasLiveData: boolean;
};

export async function getWatchFromDb(id: string): Promise<WatchDetail | null> {
  try {
    const db = getDb();
    const [watch] = await db.select().from(watches).where(eq(watches.id, id));
    if (!watch) return null;
    const prices = await db
      .select()
      .from(priceEntries)
      .where(eq(priceEntries.watchId, id))
      .orderBy(desc(priceEntries.recordedAt));
    const events = await db
      .select()
      .from(launchEvents)
      .where(eq(launchEvents.watchId, id))
      .orderBy(desc(launchEvents.date));

    const hasLiveData = (prices as Record<string, unknown>[]).some((p) => {
      if (p.source !== "aftermarket") return false;
      const name = (p.retailerName ?? p.retailer_name) as string | null | undefined;
      return name?.includes("Chrono24 (live)") || name?.includes("TheWatchAPI");
    });
    return { watch: watch as unknown as Record<string, unknown>, prices, events, hasLiveData };
  } catch (e) {
    console.error("[watches] getWatch Error:", e);
    return null;
  }
}
