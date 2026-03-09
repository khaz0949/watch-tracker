import path from "path";

/** Data directory for SQLite DB. Use DATA_DIR env for deployment (e.g. Railway volume). */
export function getDataDir(): string {
  return process.env.DATA_DIR || path.join(process.cwd(), "data");
}

export function getDbPath(): string {
  return path.join(getDataDir(), "watch.db");
}
