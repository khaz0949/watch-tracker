/**
 * Fetches the main product image from each watch's official brand page
 * (og:image or schema.org image) and updates the database.
 * Run: npx tsx scripts/fetch-watch-images.ts
 */
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { OFFICIAL_PRODUCT_URLS } from "./official-urls";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "watch.db");

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function extractImageFromHtml(html: string): string | null {
  // og:image
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogMatch?.[1]) {
    const url = ogMatch[1].trim().replace(/&amp;/g, "&");
    if (isValidProductImage(url)) return url;
  }

  // schema.org Product "image"
  const schemaMatch = html.match(/"image"\s*:\s*"([^"]+)"/);
  if (schemaMatch?.[1]) {
    const url = schemaMatch[1].trim().replace(/&amp;/g, "&");
    if (isValidProductImage(url)) return url;
  }

  return null;
}

function isValidProductImage(url: string): boolean {
  if (!url || url.includes("undefined")) return false;
  if (url.includes("meta-image.jpg") || url.includes("meta-image.png")) return false;
  if (url.includes("logo") || url.includes("favicon")) return false;
  return true;
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

async function main(): Promise<void> {
  if (!fs.existsSync(dataDir) || !fs.existsSync(dbPath)) {
    console.error("Database not found at", dbPath);
    console.error("Run: npm run db:seed");
    process.exit(1);
  }
  let db: ReturnType<typeof Database>;
  try {
    db = new Database(dbPath, { readonly: false });
  } catch (e) {
    console.error("Could not open database:", e instanceof Error ? e.message : e);
    process.exit(1);
  }
  const updateStmt = db.prepare("UPDATE watches SET image_url = ?, updated_at = ? WHERE id = ?");
  const now = new Date().toISOString();

  let updated = 0;
  let failed = 0;

  for (const [watchId, url] of Object.entries(OFFICIAL_PRODUCT_URLS)) {
    try {
      const html = await fetchHtml(url);
      const imageUrl = extractImageFromHtml(html);
      if (imageUrl) {
        updateStmt.run(imageUrl, now, watchId);
        console.log(`OK ${watchId} -> ${imageUrl.slice(0, 60)}...`);
        updated++;
      } else {
        console.warn(`No image found: ${watchId} (${url})`);
        failed++;
      }
    } catch (e) {
      console.warn(`Fail ${watchId}: ${e instanceof Error ? e.message : e}`);
      failed++;
    }
    await new Promise((r) => setTimeout(r, 800));
  }

  db.close();
  console.log(`\nDone. Updated: ${updated}, no image/failed: ${failed}`);
  if (failed > 0) {
    console.log("(Many brand sites block scripts or use JS-rendered images; seed uses fallback images.)");
  }
}

main().catch((e) => {
  console.error("Error:", e instanceof Error ? e.message : e);
  process.exit(1);
});
