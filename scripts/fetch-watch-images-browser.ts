/**
 * Fetches official product images using a real browser (Playwright).
 * Use when the fetch script gets 403 or "No image" (JS-rendered pages).
 * Run: npm run fetch-watch-images:browser
 * First time: npx playwright install chromium
 */
import { chromium } from "playwright";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { OFFICIAL_PRODUCT_URLS } from "./official-urls";
import { CURATED_IMAGES } from "./curated-images";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "watch.db");

function isValidProductImage(url: string): boolean {
  if (!url || url.includes("undefined")) return false;
  if (url.includes("meta-image.jpg") || url.includes("meta-image.png")) return false;
  if (url.includes("logo") || url.includes("favicon")) return false;
  return true;
}

async function extractImageWithBrowser(page: import("playwright").Page, url: string): Promise<string | null> {
  try {
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 25_000,
    });
    await new Promise((r) => setTimeout(r, 1500));

    const imageUrl = await page.evaluate(() => {
      const og = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
      if (og?.content) return og.content;

      const schemaScript = document.querySelector('script[type="application/ld+json"]');
      if (schemaScript?.textContent) {
        try {
          const json = JSON.parse(schemaScript.textContent);
          const img = json?.image ?? json?.["@graph"]?.find((n: { image?: string }) => n?.image)?.image;
          if (typeof img === "string") return img;
          if (Array.isArray(img) && img[0]) return img[0];
        } catch {}
      }

      // Any img or picture source (Rolex, etc. often use assets.rolex.com or similar)
      const candidates = document.querySelectorAll("img[src], picture source[srcset], img[data-src]");
      for (const el of Array.from(candidates)) {
        const img = el as HTMLImageElement | HTMLSourceElement;
        const src = img.src || img.getAttribute("src") || img.getAttribute("data-src") || (img.getAttribute("srcset") || "").split(",")[0]?.trim().split(/\s+/)[0];
        if (src && src.startsWith("http") && !src.includes("logo") && !src.includes("icon") && !src.includes("favicon")) return src;
      }
      // Scan inline for CDN URLs (e.g. Rolex injects assets in script/style)
      const html = document.documentElement.outerHTML;
      const rolexMatch = html.match(/https:\/\/assets\.rolex\.com[^\s"'>]+\.(?:jpg|jpeg|png|webp)/i);
      if (rolexMatch) return rolexMatch[0];
      return null;
    });

    if (imageUrl && isValidProductImage(imageUrl)) return imageUrl;
  } catch {
    // timeout or navigation error
  }
  return null;
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

  console.log("Launching browser (first run may download Chromium: npx playwright install chromium)...\n");

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

  for (const [watchId, url] of Object.entries(OFFICIAL_PRODUCT_URLS)) {
    try {
      let imageUrl = await extractImageWithBrowser(page, url);
      if (!imageUrl && CURATED_IMAGES[watchId]) imageUrl = CURATED_IMAGES[watchId];
      if (imageUrl) {
        updateStmt.run(imageUrl, now, watchId);
        const label = CURATED_IMAGES[watchId] && imageUrl === CURATED_IMAGES[watchId] ? " (curated)" : "";
        console.log(`OK ${watchId}${label} -> ${imageUrl.slice(0, 65)}${imageUrl.length > 65 ? "..." : ""}`);
        updated++;
      } else {
        console.warn(`No image: ${watchId} (${url})`);
        failed++;
      }
    } catch (e) {
      console.warn(`Fail ${watchId}: ${e instanceof Error ? e.message : e}`);
      failed++;
    }
    await new Promise((r) => setTimeout(r, 600));
  }

  await browser.close();
  db.close();

  console.log(`\nDone. Updated: ${updated}, no image/failed: ${failed}`);
}

main().catch((e) => {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("Error:", msg);
  if (/Executable doesn't exist|browserType\.launch|Could not find browser/.test(msg)) {
    console.error("\nInstall Chromium first: npx playwright install chromium");
  }
  process.exit(1);
});
