/**
 * Pull live Chrono24 prices for all watches via Retailed.io and save to DB.
 * Get a key at https://app.retailed.io → API Keys, put it in .env as RETAILED_API_KEY=your_key, then run: npm run refresh-chrono24
 * MSRP is left unchanged (benchmark from Rolex.com / official sites). Only aftermarket (Chrono24) is updated.
 *
 * API quota: Retailed.io limits requests per plan. Each watch = 1 call. If you hit "usage limit reached" (402):
 *   - Set REFRESH_CORE_ONLY=true in .env to refresh only Rolex, AP, Patek, Cartier, Richard Mille (~65 models).
 *   - Or upgrade your Retailed plan for more requests.
 */

import "dotenv/config";
import Database from "better-sqlite3";
import fs from "fs";
import { getDbPath } from "../lib/db-path";
import { fetchChrono24PriceStats, verifyRetailedKey, sanitizeRetailedKey } from "../lib/chrono24-live";

const dbPath = getDbPath();

/** When REFRESH_CORE_ONLY=true, only these brands are refreshed (fits typical Retailed quota). */
const CORE_BRANDS = new Set([
  "Rolex",
  "Audemars Piguet",
  "Patek Philippe",
  "Cartier",
  "Richard Mille",
]);

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function main() {
  const rawKey = process.env.RETAILED_API_KEY;
  const apiKey = sanitizeRetailedKey(rawKey);
  if (!apiKey) {
    console.error("Set RETAILED_API_KEY with your real key from https://app.retailed.io (API Keys).");
    console.error("Example: RETAILED_API_KEY=abc123xyz npm run refresh-chrono24");
    process.exit(1);
  }
  const verified = await verifyRetailedKey(apiKey);
  if (!verified.ok) {
    // Usage endpoint can return 400/404; don't block if key might still work for Chrono24 search
    if (verified.error?.includes("400") || verified.error?.includes("404")) {
      console.warn("Usage endpoint returned", verified.error, "— continuing; first request will confirm key.");
    } else {
      console.error("Retailed API key check failed:", verified.error);
      process.exit(1);
    }
  } else {
    console.log("Retailed API key OK.");
  }

  if (!fs.existsSync(dbPath)) {
    console.error("Database not found. Run npm run db:seed first.");
    process.exit(1);
  }

  const sqlite = new Database(dbPath);
  const now = new Date().toISOString();
  const recordedAt = new Date().toISOString().slice(0, 19) + "Z";

  let watches = sqlite.prepare("SELECT id, brand, reference, name FROM watches").all() as {
    id: string;
    brand: string;
    reference: string | null;
    name: string;
  }[];

  const coreOnly = process.env.REFRESH_CORE_ONLY === "true" || process.env.REFRESH_CORE_ONLY === "1";
  if (coreOnly) {
    watches = watches.filter((w) => CORE_BRANDS.has(w.brand));
    console.log(`REFRESH_CORE_ONLY=true: refreshing only Rolex, AP, Patek, Cartier, Richard Mille (${watches.length} models).`);
  }

  const limit = parseInt(process.env.REFRESH_LIMIT || "0", 10);
  if (limit > 0) {
    watches = watches.slice(0, limit);
    console.log(`REFRESH_LIMIT=${limit}: refreshing only first ${watches.length} models (for testing / small quota).`);
  }

  if (watches.length === 0) {
    console.log("No watches in DB (or no matches for core-only). Run npm run db:seed first.");
    sqlite.close();
    return;
  }

  const insert = sqlite.prepare(
    `INSERT INTO price_entries (id, watch_id, source, retailer_name, price, recorded_at, created_at) VALUES (?, ?, 'aftermarket', ?, ?, ?, ?)`
  );

  console.log(`Fetching Chrono24 live prices for ${watches.length} models…`);
  let ok = 0;
  let skip = 0;
  let quotaExhausted = false;

  for (let i = 0; i < watches.length; i++) {
    const w = watches[i]!;
    const ref = w.reference || w.name;
    process.stdout.write(`\r  ${i + 1}/${watches.length} ${w.brand} ${ref}   `);
    try {
      const stats = await fetchChrono24PriceStats(apiKey, w.brand, ref);
      if (stats) {
        const priceCents = Math.round(stats.medianPriceUsd * 100);
        insert.run(id("p"), w.id, "Chrono24 (live)", priceCents, recordedAt, now);
        ok++;
      } else {
        skip++;
      }
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes("usage limit") || msg.includes("402")) {
        quotaExhausted = true;
        console.warn(`\nRetailed usage limit reached after ${ok} models. Stop. Add REFRESH_CORE_ONLY=true to .env to refresh only core brands (~65 models) next time.`);
        break;
      }
      console.warn(`\n  Skip ${w.brand} ${ref}:`, msg);
      skip++;
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  sqlite.close();
  console.log(`\nDone. Updated ${ok} models with Chrono24 live prices, skipped ${skip}.`);
  if (quotaExhausted) {
    console.log("Tip: Set REFRESH_CORE_ONLY=true in .env to refresh only Rolex, AP, Patek, Cartier, Richard Mille and stay within your plan.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
