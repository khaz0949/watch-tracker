/**
 * Chrono24 ref/search URLs per watch. Used by fetch-chrono24-images to load listing images.
 * Format: chrono24.com/{brand-slug}/ref-{ref}.htm (ref normalized for URL).
 */
function refSlug(ref: string | null): string {
  if (!ref) return "";
  return ref.replace(/\s*\/\s*/g, "-").replace(/\s+/g, "").toLowerCase();
}

const BRAND_SLUG: Record<string, string> = {
  Rolex: "rolex",
  "Audemars Piguet": "audemarspiguet",
  "Patek Philippe": "patekphilippe",
  Cartier: "cartier",
  "Richard Mille": "richardmille",
  Omega: "omega",
  "TAG Heuer": "tagheuer",
  "Grand Seiko": "grandseiko",
  Panerai: "panerai",
  Hublot: "hublot",
  "IWC Schaffhausen": "iwc",
  Breitling: "breitling",
  Tudor: "tudor",
  Longines: "longines",
  "A. Lange & Söhne": "alangesoehne",
  "Vacheron Constantin": "vacheronconstantin",
  "Jaeger-LeCoultre": "jaegerlecoultre",
  Breguet: "breguet",
  Chopard: "chopard",
  Bulgari: "bulgari",
  Seiko: "seiko",
  Casio: "casio",
  Citizen: "citizen",
  "Nomos Glashütte": "nomosglashuette",
  "Glashütte Original": "glashuetteoriginal",
};

export function getChrono24RefUrl(brand: string, reference: string | null): string {
  const slug = BRAND_SLUG[brand] ?? brand.toLowerCase().replace(/\s+/g, "");
  const ref = refSlug(reference);
  if (!ref) return `https://www.chrono24.com/${slug}/index.htm`;
  return `https://www.chrono24.com/${slug}/ref-${ref}.htm`;
}

import { WATCH_MODELS } from "./watch-models";

/** Watch id → Chrono24 ref page URL (for image scraping). Built from all tracked models. */
export function getChrono24Urls(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [id, _name, brand, ref] of WATCH_MODELS) {
    out[id] = getChrono24RefUrl(brand, ref);
  }
  return out;
}
