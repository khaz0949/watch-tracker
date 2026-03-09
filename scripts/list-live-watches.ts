/**
 * List which watches have live Chrono24 data vs benchmark only.
 * Run: npm run list-live (or: tsx scripts/list-live-watches.ts)
 */

import path from "path";
import Database from "better-sqlite3";
import fs from "fs";

const dbPath = path.join(process.cwd(), "data", "watch.db");

function main() {
  if (!fs.existsSync(dbPath)) {
    console.error("Database not found. Run npm run db:seed first.");
    process.exit(1);
  }
  const db = new Database(dbPath);

  const withLive = db
    .prepare(
      `
    SELECT DISTINCT w.id, w.brand, w.name, w.reference
    FROM watches w
    INNER JOIN price_entries p ON p.watch_id = w.id
    WHERE p.source = 'aftermarket'
      AND (p.retailer_name LIKE '%Chrono24 (live)%' OR p.retailer_name LIKE '%TheWatchAPI%')
    ORDER BY w.brand, w.reference
  `
    )
    .all() as { id: string; brand: string; name: string; reference: string | null }[];

  const allWatches = db
    .prepare("SELECT id, brand, name, reference FROM watches ORDER BY brand, reference")
    .all() as { id: string; brand: string; name: string; reference: string | null }[];

  const liveIds = new Set(withLive.map((w) => w.id));
  const withoutLive = allWatches.filter((w) => !liveIds.has(w.id));

  console.log("=== WATCHES WITH LIVE CHRONO24 DATA ===\n");
  console.log(`Total: ${withLive.length}\n`);
  let prevBrand = "";
  for (const w of withLive) {
    if (w.brand !== prevBrand) {
      prevBrand = w.brand;
      console.log(`\n${w.brand}`);
    }
    console.log(`  • ${w.name} (${w.reference ?? "—"})`);
  }

  console.log("\n\n=== WATCHES WITH BENCHMARK DATA ONLY (no live) ===\n");
  console.log(`Total: ${withoutLive.length}\n`);
  prevBrand = "";
  for (const w of withoutLive) {
    if (w.brand !== prevBrand) {
      prevBrand = w.brand;
      console.log(`\n${w.brand}`);
    }
    console.log(`  • ${w.name} (${w.reference ?? "—"})`);
  }

  db.close();
}

main();
