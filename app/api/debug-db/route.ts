import { NextResponse } from "next/server";
import fs from "fs";
import Database from "better-sqlite3";
import { getDataDir, getDbPath } from "@/lib/db-path";
import { getDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const dataDir = getDataDir();
  const dbPath = getDbPath();

  const dbExists = fs.existsSync(dbPath);
  let watches = 0;
  let priceEntries = 0;
  let aftermarket = 0;
  let retailer = 0;
  let liveCount = 0;
  let sample: { watch_id: string; source: string; retailer_name: string; year: string }[] = [];
  let liveSample: { watch_id: string; retailer_name: string }[] = [];

  if (dbExists) {
    const db = new Database(dbPath);
    watches = (db.prepare("SELECT COUNT(*) as n FROM watches").get() as { n: number }).n;
    priceEntries = (db.prepare("SELECT COUNT(*) as n FROM price_entries").get() as { n: number }).n;
    aftermarket = (db.prepare("SELECT COUNT(*) as n FROM price_entries WHERE source = 'aftermarket'").get() as { n: number }).n;
    retailer = (db.prepare("SELECT COUNT(*) as n FROM price_entries WHERE source = 'retailer'").get() as { n: number }).n;
    liveCount = (db.prepare(
      "SELECT COUNT(*) as n FROM price_entries WHERE retailer_name LIKE '%Chrono24 (live)%' OR retailer_name LIKE '%TheWatchAPI%'"
    ).get() as { n: number }).n;
    sample = db.prepare(
      "SELECT watch_id, source, retailer_name, substr(recorded_at, 1, 4) as year FROM price_entries LIMIT 5"
    ).all() as { watch_id: string; source: string; retailer_name: string; year: string }[];
    liveSample = db.prepare(
      "SELECT watch_id, retailer_name FROM price_entries WHERE retailer_name LIKE '%Chrono24 (live)%' OR retailer_name LIKE '%TheWatchAPI%' LIMIT 5"
    ).all() as { watch_id: string; retailer_name: string }[];
    db.close();
  }

  const dashboard = await getDashboardData();
  const bestCount = dashboard?.bestPerforming?.length ?? 0;
  const bestWithLive = dashboard?.bestPerforming?.filter((b) => b.hasLiveData) ?? [];
  const dataSource = dashboard?.dataSource ?? null;

  return NextResponse.json({
    cwd: process.cwd(),
    dbPath,
    dbExists,
    watches,
    priceEntries,
    aftermarket,
    retailer,
    liveCount,
    liveSample,
    sample,
    dashboardBestCount: bestCount,
    dashboardBestWithLiveCount: bestWithLive.length,
    dashboardDataSource: dataSource,
    dashboardTotalWatches: dashboard?.totalWatches ?? null,
  });
}
