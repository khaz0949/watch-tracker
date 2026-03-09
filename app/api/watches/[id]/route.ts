import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { watches, priceEntries, launchEvents } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();
    const [watch] = await db.select().from(watches).where(eq(watches.id, id));
    if (!watch) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
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
    return NextResponse.json({ watch, prices, events, hasLiveData });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch watch" },
      { status: 500 }
    );
  }
}
