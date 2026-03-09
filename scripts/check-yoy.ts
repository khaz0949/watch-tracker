/**
 * Verify benchmark YoY data. Run: npx tsx scripts/check-yoy.ts
 */
import path from "path";
import Database from "better-sqlite3";

const dbPath = path.join(process.cwd(), "data", "watch.db");
const db = new Database(dbPath);

const rows = db.prepare(`
  SELECT watch_id, retailer_name, substr(recorded_at, 1, 4) as year, price
  FROM price_entries
  WHERE source = 'aftermarket' AND watch_id = 'seed-rolex-126610ln'
  ORDER BY recorded_at
`).all() as { watch_id: string; retailer_name: string; year: string; price: number }[];

console.log("Sample aftermarket prices for Rolex 126610LN:");
rows.forEach((r) => console.log(`  ${r.year}: ${r.price} cents (${r.retailer_name})`));

if (rows.length >= 2) {
  const [a, b] = rows;
  const yoy = ((a.price - b.price) / b.price) * 100;
  console.log(`\nYoY ${b.year}→${a.year}: ${yoy.toFixed(1)}%`);
}

db.close();
