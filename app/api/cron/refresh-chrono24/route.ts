/**
 * Cron endpoint: pull live Chrono24 prices via Retailed.io and save to DB.
 * Call with: GET or POST /api/cron/refresh-chrono24
 * Optional: set CRON_SECRET and pass ?secret=CRON_SECRET to prevent public calls.
 * Requires RETAILED_API_KEY in env.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { watches, priceEntries } from "@/lib/db/schema";
import { fetchChrono24PriceStats } from "@/lib/chrono24-live";

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const q = new URL(req.url).searchParams.get("secret");
    if (q !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RETAILED_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "RETAILED_API_KEY not set. Add it in env to use Chrono24 live prices." },
      { status: 503 }
    );
  }

  try {
    const db = getDb();
    const allWatches = await db.select({ id: watches.id, brand: watches.brand, reference: watches.reference, name: watches.name }).from(watches);
    if (allWatches.length === 0) {
      return NextResponse.json({ ok: true, updated: 0, message: "No watches in DB." });
    }

    const now = new Date().toISOString();
    const recordedAt = new Date().toISOString().slice(0, 19) + "Z";
    let updated = 0;

    for (const w of allWatches) {
      const ref = w.reference || w.name;
      try {
        const stats = await fetchChrono24PriceStats(apiKey, w.brand, ref);
        if (stats) {
          const priceCents = Math.round(stats.medianPriceUsd * 100);
          await db.insert(priceEntries).values({
            id: id("p"),
            watchId: w.id,
            source: "aftermarket",
            retailerName: "Chrono24 (live)",
            price: priceCents,
            recordedAt,
            createdAt: now,
          });
          updated++;
        }
      } catch {
        // skip this watch
      }
      await new Promise((r) => setTimeout(r, 400));
    }

    return NextResponse.json({ ok: true, updated, total: allWatches.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}
