import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { watches, priceEntries } from "@/lib/db/schema";
import { desc, eq, or, like, and, isNotNull } from "drizzle-orm";

export async function GET() {
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

    const listWithLive = list.map((w) => ({
      ...w,
      hasLiveData: liveIds.has(w.id),
    }));
    return NextResponse.json(listWithLive);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch watches" },
      { status: 500 }
    );
  }
}
