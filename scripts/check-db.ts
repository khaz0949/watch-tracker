/**
 * Quick check: does the DB have data? Run: npx tsx scripts/check-db.ts
 */
import path from "path";
import fs from "fs";
import Database from "better-sqlite3";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "watch.db");

console.log("DB path:", dbPath);
console.log("Data dir exists:", fs.existsSync(dataDir));
console.log("DB file exists:", fs.existsSync(dbPath));

if (!fs.existsSync(dbPath)) {
  console.log("\n❌ No database. Run: npm run db:seed");
  process.exit(1);
}

const db = new Database(dbPath);
const watches = db.prepare("SELECT COUNT(*) as n FROM watches").get() as { n: number };
const prices = db.prepare("SELECT COUNT(*) as n FROM price_entries").get() as { n: number };
const aftermarket = db.prepare(
  "SELECT COUNT(*) as n FROM price_entries WHERE source = 'aftermarket'"
).get() as { n: number };
const retailer = db.prepare(
  "SELECT COUNT(*) as n FROM price_entries WHERE source = 'retailer'"
).get() as { n: number };

console.log("\nWatches:", watches.n);
console.log("Price entries:", prices.n);
console.log("  - aftermarket:", aftermarket.n);
console.log("  - retailer:", retailer.n);

if (prices.n > 0) {
  const sample = db.prepare(
    "SELECT watch_id, source, retailer_name, recorded_at FROM price_entries LIMIT 5"
  ).all() as { watch_id: string; source: string; retailer_name: string; recorded_at: string }[];
  console.log("\nSample price entries:");
  sample.forEach((r) => console.log(" ", r.watch_id, r.source, r.retailer_name, r.recorded_at?.slice(0, 4)));
}

db.close();

if (prices.n === 0) {
  console.log("\n❌ No price entries. Run: npm run db:seed");
  process.exit(1);
}
console.log("\n✅ DB has data. If the site still shows 'No demand data yet', the app may be using a different DB path.");
