import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import fs from "fs";
import { getDataDir, getDbPath } from "../db-path";

export function getDb() {
  const dataDir = getDataDir();
  const dbPath = getDbPath();
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const sqlite = new Database(dbPath);
  return drizzle(sqlite, { schema });
}

export * from "./schema";
