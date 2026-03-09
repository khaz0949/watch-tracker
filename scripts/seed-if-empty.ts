/**
 * Run db:seed only if the database is empty or doesn't exist.
 * Used at deploy start so we don't wipe data on every restart.
 */
import fs from "fs";
import Database from "better-sqlite3";
import { getDataDir, getDbPath } from "../lib/db-path";

const dataDir = getDataDir();
const dbPath = getDbPath();

if (!fs.existsSync(dataDir) || !fs.existsSync(dbPath)) {
  console.log("No database found. Running seed...");
  const { execSync } = require("child_process");
  execSync("npm run db:seed", { stdio: "inherit" });
} else {
  const db = new Database(dbPath);
  const count = (db.prepare("SELECT COUNT(*) as n FROM watches").get() as { n: number }).n;
  db.close();

  if (count === 0) {
    console.log("Database empty. Running seed...");
    const { execSync } = require("child_process");
    execSync("npm run db:seed", { stdio: "inherit" });
  } else {
    console.log(`Database has ${count} watches. Skipping seed.`);
  }
}
