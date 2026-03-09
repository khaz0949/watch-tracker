import Database from "better-sqlite3";
import fs from "fs";
import { getDataDir, getDbPath } from "../lib/db-path";
import { CURATED_IMAGES } from "./curated-images";
import { WATCH_MODELS } from "./watch-models";
import {
  getSegment,
  getMsrpOverride,
  AFTERMARKET_BY_YEAR,
} from "./realistic-prices";
import { fetchAllRealPrices, type WatchRow } from "./fetch-real-prices";

const dataDir = getDataDir();
const dbPath = getDbPath();
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const sqlite = new Database(dbPath);

const now = new Date().toISOString();
const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Real watch images from Wikimedia Commons (CC / GFDL). One representative image per brand.
const WIKI = "https://upload.wikimedia.org/wikipedia/commons";
const WATCH_IMAGES: Record<string, string> = {
  Rolex: `${WIKI}/f/f4/Rolex_Submariner.JPG`,
  "Audemars Piguet": `${WIKI}/7/7c/Royal_Oak_Offshore_watch_by_Audemars_Piguet.JPG`,
  "Patek Philippe": `${WIKI}/7/74/Patek-Philippe-Nautilus-5711.jpg`,
  Cartier: `${WIKI}/9/99/Cartier_Santos_1988.jpg`,
  "Richard Mille": `${WIKI}/b/bc/YL_07930-Richard_Mille_01.jpg`,
};
const watchImage = (brand: string, watchId?: string) => {
  if (watchId && CURATED_IMAGES[watchId]) return CURATED_IMAGES[watchId];
  return WATCH_IMAGES[brand] ?? `https://placehold.co/400x300/1e293b/94a3b8?text=${encodeURIComponent(brand)}`;
};

async function seed() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS watches (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      reference TEXT,
      launch_date TEXT,
      msrp INTEGER,
      currency TEXT DEFAULT 'USD',
      image_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS price_entries (
      id TEXT PRIMARY KEY,
      watch_id TEXT NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
      source TEXT NOT NULL,
      retailer_name TEXT,
      price INTEGER NOT NULL,
      currency TEXT DEFAULT 'USD',
      recorded_at TEXT NOT NULL,
      url TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS launch_events (
      id TEXT PRIMARY KEY,
      watch_id TEXT NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Clear benchmark/retailer data but preserve live Chrono24 entries (so refresh-chrono24 data survives re-seed)
  sqlite.exec(`
    DELETE FROM price_entries
    WHERE source = 'retailer'
       OR (source = 'aftermarket' AND retailer_name NOT LIKE '%Chrono24 (live)%' AND retailer_name NOT LIKE '%TheWatchAPI%')
  `);

  const insertWatch = sqlite.prepare(
    `INSERT OR IGNORE INTO watches (id, name, brand, reference, launch_date, msrp, currency, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'USD', ?, ?, ?)`
  );
  for (const [wid, name, brand, ref, launch, msrpCents] of WATCH_MODELS) {
    const msrpUsd = getMsrpOverride(ref) ?? msrpCents / 100;
    const msrp = Math.round(msrpUsd * 100);
    insertWatch.run(wid, name, brand, ref, launch, msrp, watchImage(brand, wid), now, now);
  }
  // Apply curated image when we have one (so known models show the correct image)
  const updateImg = sqlite.prepare(`UPDATE watches SET image_url = ?, updated_at = ? WHERE id = ?`);
  for (const [wid, _name, brand] of WATCH_MODELS) {
    const imageUrl = watchImage(brand, wid);
    updateImg.run(imageUrl, now, wid);
  }

  const baseYears = [2022, 2023, 2024] as const;
  const insertPrice = sqlite.prepare(
    `INSERT OR IGNORE INTO price_entries (id, watch_id, source, retailer_name, price, recorded_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const apiToken = process.env.THEWATCHAPI_API_TOKEN?.trim();
  const watchList: WatchRow[] = WATCH_MODELS.map(([wid, name, brand, ref, _launch, msrpCents]) => ({
    wid,
    ref,
    name,
    brand,
    msrpCents,
  }));

  if (apiToken) {
    let real: Map<string, { 2022: number; 2023: number; 2024: number }>;
    try {
      console.log("Fetching real prices from TheWatchAPI…");
      real = await fetchAllRealPrices(watchList, apiToken, (cur, tot, ref) =>
        process.stdout.write(`\r  ${cur}/${tot} ${ref}   `)
      );
      console.log("\nReal price history for", real.size, "references.");
    } catch (e) {
      console.warn("TheWatchAPI failed:", (e as Error).message);
      console.log("Using benchmark prices so the site has data.");
      real = new Map();
    }
    for (const [wid, prices] of real) {
      const w = watchList.find((x) => x.wid === wid)!;
      const msrpUsd = getMsrpOverride(w.ref) ?? w.msrpCents / 100;
      const msrp = Math.round(msrpUsd * 100);
      for (const year of baseYears) {
        const recordedAt = `${year}-06-15T12:00:00Z`;
        insertPrice.run(id("p"), wid, "retailer", "Official / AD", msrp, recordedAt, now);
        const aftermarketCents = Math.round(prices[year] * 100);
        insertPrice.run(id("p"), wid, "aftermarket", "Chrono24 (TheWatchAPI)", aftermarketCents, recordedAt, now);
      }
    }
    for (const w of watchList) {
      if (real.has(w.wid)) continue;
      const msrpUsd = getMsrpOverride(w.ref) ?? w.msrpCents / 100;
      const msrp = Math.round(msrpUsd * 100);
      const segment = getSegment(w.brand, w.ref, w.name);
      const mults = AFTERMARKET_BY_YEAR[segment];
      const t = ((w.wid.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0) % 1000) / 1000);
      const variance = 1 + (t - 0.5) * 0.04;
      for (const year of baseYears) {
        const recordedAt = `${year}-06-15T12:00:00Z`;
        insertPrice.run(id("p"), w.wid, "retailer", "Official / AD", msrp, recordedAt, now);
        const aftermarketPrice = Math.round(msrpUsd * mults[year] * variance * 100);
        insertPrice.run(id("p"), w.wid, "aftermarket", "Chrono24 avg (fallback)", aftermarketPrice, recordedAt, now);
      }
    }
  } else {
    const trait = (watchId: string) => {
      let h = 0;
      for (let i = 0; i < watchId.length; i++) h = (h * 31 + watchId.charCodeAt(i)) >>> 0;
      return (h % 1000) / 1000;
    };
    // Per-watch growth so YoY differs per model (variance in growth rate, not just level)
    for (const [wid, name, brand, ref, _launch, msrpCents] of WATCH_MODELS) {
      const msrpUsd = getMsrpOverride(ref) ?? msrpCents / 100;
      const msrp = Math.round(msrpUsd * 100);
      const segment = getSegment(brand, ref, name);
      const base = AFTERMARKET_BY_YEAR[segment];
      const t = trait(wid);
      const growthVariance = (t - 0.5) * 0.05; // ±2.5% per year so each watch has unique YoY
      let mult = base["2022"] * (1 + (t - 0.5) * 0.04);
      for (const year of baseYears) {
        const recordedAt = `${year}-06-15T12:00:00Z`;
        insertPrice.run(id("p"), wid, "retailer", "Official / AD", msrp, recordedAt, now);
        if (year === 2023) mult = mult * (base["2023"] / base["2022"]) * (1 + growthVariance);
        if (year === 2024) mult = mult * (base["2024"] / base["2023"]) * (1 + growthVariance);
        const aftermarketPrice = Math.round(msrpUsd * mult * 100);
        insertPrice.run(id("p"), wid, "aftermarket", "Chrono24 avg", aftermarketPrice, recordedAt, now);
      }
    }
  }

  // A few launch events
  const insertEvent = sqlite.prepare(
    `INSERT OR IGNORE INTO launch_events (id, watch_id, event_type, date, note, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  );
  insertEvent.run(id("e"), "seed-rolex-126610ln", "launch", "2020-09-01", "41mm Submariner Date release", now);
  insertEvent.run(id("e"), "seed-rolex-126500ln", "launch", "2023-03-01", "New Cerachrom bezel, 126500", now);
  insertEvent.run(id("e"), "seed-ap-15500st", "launch", "2019-01-01", "15500ST release", now);
  insertEvent.run(id("e"), "seed-patek-5711-1a-010", "discontinuation", "2021-12-31", "5711/1A discontinued", now);

  const watchCount = sqlite.prepare("SELECT COUNT(*) as n FROM watches").get() as { n: number };
  const priceCount = sqlite.prepare("SELECT COUNT(*) as n FROM price_entries").get() as { n: number };
  console.log("Seed complete. Database at", dbPath);
  console.log("Watches:", watchCount.n, "| Price entries:", priceCount.n);
  sqlite.close();
  console.log("\nTo view the site: run  npm run dev  then open http://localhost:3000");
}

(async () => {
  try {
    await seed();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
