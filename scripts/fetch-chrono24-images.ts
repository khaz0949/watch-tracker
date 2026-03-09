/**
 * Fetches watch images from Chrono24 ref pages using Playwright.
 * Run: npm run fetch-chrono24-images
 * Requires: npx playwright install chromium
 */
import { chromium } from "playwright";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { getChrono24Urls } from "./chrono24-urls";
import { CURATED_IMAGES } from "./curated-images";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "watch.db");

function isChrono24Image(src: string): boolean {
  if (!src || !src.startsWith("http")) return false;
  if (!src.includes("chrono24.com") && !src.includes("img.chrono24")) return false;
  if (/logo|icon|avatar|favicon|placeholder/i.test(src)) return false;
  return true;
}

async function extractChrono24Image(page: import("playwright").Page, url: string): Promise<string | null> {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25_000 });
    await new Promise((r) => setTimeout(r, 3000));

    let imageUrl = await page.evaluate(() => {
      for (const img of Array.from(document.querySelectorAll("img"))) {
        const src = (img as HTMLImageElement).src || (img as HTMLImageElement).getAttribute("data-src");
        if (src && (src.includes("img.chrono24.com") || src.includes("cdn2.chrono24.com")) && !src.includes("logo")) return src;
      }
      const html = document.documentElement.outerHTML;
      const m = html.match(/https:\/\/(?:img|cdn2)\.chrono24\.com\/[^\s"'>]+\.(?:jpg|jpeg|png|webp)/i);
      return m ? m[0] : null;
    });

    if (imageUrl && isChrono24Image(imageUrl)) return imageUrl;

    const firstListing = await page.evaluate(() => {
      const link = document.querySelector('a[href*="/rolex/"][href*="--id"], a[href*="/audemarspiguet/"][href*="--id"], a[href*="/patekphilippe/"][href*="--id"], a[href*="/cartier/"][href*="--id"], a[href*="/richardmille/"][href*="--id"]') as HTMLAnchorElement | null;
      const href = link?.href;
      if (href && href.includes("chrono24.com") && href.includes("-id")) return href;
      return null;
    });

    if (firstListing) {
      await page.goto(firstListing, { waitUntil: "domcontentloaded", timeout: 20_000 });
      await new Promise((r) => setTimeout(r, 2500));
      imageUrl = await page.evaluate(() => {
        for (const img of Array.from(document.querySelectorAll("img"))) {
          const src = (img as HTMLImageElement).src || (img as HTMLImageElement).getAttribute("data-src");
          if (src && (src.includes("img.chrono24.com") || src.includes("cdn2.chrono24.com")) && !src.includes("logo")) return src;
        }
        const html = document.documentElement.outerHTML;
        const m = html.match(/https:\/\/(?:img|cdn2)\.chrono24\.com\/[^\s"'>]+\.(?:jpg|jpeg|png|webp)/i);
        return m ? m[0] : null;
      });
      if (imageUrl && isChrono24Image(imageUrl)) return imageUrl;
    }

    return null;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  if (!fs.existsSync(dataDir) || !fs.existsSync(dbPath)) {
    console.error("Database not found. Run: npm run db:seed");
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
  const urls = getChrono24Urls();

  console.log("Launching browser to fetch Chrono24 images...\n");

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 720 },
    locale: "en-US",
  });

  const page = await context.newPage();

  let updated = 0;
  let failed = 0;

  for (const [watchId, chronoUrl] of Object.entries(urls)) {
    try {
      let imageUrl = await extractChrono24Image(page, chronoUrl);
      if (!imageUrl && CURATED_IMAGES[watchId]) imageUrl = CURATED_IMAGES[watchId];
      if (imageUrl) {
        updateStmt.run(imageUrl, now, watchId);
        const fromChrono = imageUrl.includes("chrono24.com");
        console.log(`OK ${watchId}${fromChrono ? "" : " (fallback)"} -> ${imageUrl.slice(0, 65)}${imageUrl.length > 65 ? "..." : ""}`);
        updated++;
      } else {
        console.warn(`No image: ${watchId} (${chronoUrl})`);
        failed++;
      }
    } catch (e) {
      console.warn(`Fail ${watchId}: ${e instanceof Error ? e.message : e}`);
      failed++;
    }
    await new Promise((r) => setTimeout(r, 800));
  }

  await browser.close();
  db.close();

  console.log(`\nDone. Updated: ${updated}, failed: ${failed}`);
}

main().catch((e) => {
  console.error("Error:", e instanceof Error ? e.message : e);
  if (/Executable doesn't exist|browserType\.launch|Could not find browser/.test(String(e))) {
    console.error("\nInstall Chromium: npx playwright install chromium");
  }
  process.exit(1);
});
