/**
 * Run db:seed only if the database is empty or doesn't exist.
 * Used at deploy start so we don't wipe data on every restart.
 * Set FORCE_RESeed=true in env to always run seed (useful when data is missing on Railway).
 */
import fs from "fs";
import Database from "better-sqlite3";
import { getDataDir, getDbPath } from "../lib/db-path";

const dataDir = getDataDir();
const dbPath = getDbPath();
const forceReseed = process.env.FORCE_RESeed === "true" || process.env.FORCE_RESeed === "1";

function runSeed() {
  console.log("[seed-if-empty] Running seed...");
  try {
    const { execSync } = require("child_process");
    execSync("npm run db:seed", { stdio: "inherit" });
    console.log("[seed-if-empty] Seed completed.");
  } catch (e) {
    console.error("[seed-if-empty] Seed failed:", e);
    process.exit(1);
  }
}

if (forceReseed) {
  console.log("[seed-if-empty] FORCE_RESeed is set. Running seed...");
  runSeed();
} else if (!fs.existsSync(dataDir) || !fs.existsSync(dbPath)) {
  console.log("[seed-if-empty] No database found. Running seed...");
  runSeed();
} else {
  try {
    const db = new Database(dbPath);
    const count = (db.prepare("SELECT COUNT(*) as n FROM watches").get() as { n: number }).n;
    db.close();

    if (count === 0) {
      console.log("[seed-if-empty] Database empty. Running seed...");
      runSeed();
    } else {
      console.log(`[seed-if-empty] Database has ${count} watches. Skipping seed.`);
    }
  } catch (e) {
    console.error("[seed-if-empty] Error checking DB:", e);
    console.log("[seed-if-empty] Running seed anyway...");
    runSeed();
  }
}
