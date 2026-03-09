import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { watches, priceEntries } from "@/lib/db/schema";
import { desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDb();
    const totalWatches = await db.select({ count: sql<number>`count(*)` }).from(watches);
    const recentPrices = await db
      .select()
      .from(priceEntries)
      .orderBy(desc(priceEntries.recordedAt))
      .limit(20);
    return NextResponse.json({
      totalWatches: Number(totalWatches[0]?.count ?? 0),
      recentPrices,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
