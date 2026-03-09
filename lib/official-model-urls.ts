/**
 * Official model-page URLs for each watch so "Verify at official site" links
 * to the specific model on the brand's site, not just the homepage.
 * Uses known URL patterns for Rolex, Patek, AP, Cartier, Richard Mille, etc.
 */

import { getOfficialBenchmarkUrl } from "@/lib/brands";

/** Rolex: /en-us/watches/{collection}/{mref} e.g. submariner/m126610ln-0001 */
function rolexModelUrl(reference: string, name: string): string {
  const base = "https://www.rolex.com/en-us/watches";
  const mref = "m" + reference.toLowerCase().replace(/\s/g, "") + "-0001";
  const nameLower = name.toLowerCase();
  let collection = "submariner";
  if (nameLower.includes("cosmograph") || nameLower.includes("daytona")) collection = "cosmograph-daytona";
  else if (nameLower.includes("gmt-master") || nameLower.includes("gmt master")) collection = "gmt-master-ii";
  else if (nameLower.includes("datejust") && !nameLower.includes("lady")) collection = "datejust";
  else if (nameLower.includes("lady-datejust")) collection = "lady-datejust";
  else if (nameLower.includes("day-date")) collection = "day-date";
  else if (nameLower.includes("explorer ii")) collection = "explorer-ii";
  else if (nameLower.includes("explorer")) collection = "explorer";
  else if (nameLower.includes("yacht-master") || nameLower.includes("yacht master")) collection = "yacht-master";
  else if (nameLower.includes("sea-dweller") || nameLower.includes("sea dweller")) collection = "sea-dweller";
  else if (nameLower.includes("deepsea")) collection = "deepsea";
  else if (nameLower.includes("air-king") || nameLower.includes("air king")) collection = "air-king";
  else if (nameLower.includes("oyster perpetual") || nameLower.includes("oyster perpetual")) collection = "oyster-perpetual";
  else if (nameLower.includes("sky-dweller") || nameLower.includes("sky dweller")) collection = "sky-dweller";
  else if (nameLower.includes("milgauss")) collection = "milgauss";
  else if (nameLower.includes("submariner")) collection = "submariner";
  return `${base}/${collection}/${mref}`;
}

/** Patek: /en/collection/{line}/{ref-slug} e.g. nautilus/5726-1a-014 */
function patekModelUrl(reference: string, name: string): string {
  const base = "https://www.patek.com/en/collection";
  const refSlug = reference.replace(/\s*\/\s*/g, "-").replace(/\s+/g, "").toLowerCase();
  const nameLower = name.toLowerCase();
  let line = "nautilus";
  if (nameLower.includes("aquanaut")) line = "aquanaut";
  else if (nameLower.includes("calatrava")) line = "calatrava";
  else if (nameLower.includes("perpetual calendar")) line = "grand-complications";
  else if (nameLower.includes("world time")) line = "grand-complications";
  else if (nameLower.includes("chronograph") && !nameLower.includes("nautilus")) line = "grand-complications";
  else if (nameLower.includes("nautilus")) line = "nautilus";
  return `${base}/${line}/${refSlug}`;
}

/** AP: collection page by line (exact ref URLs vary). */
function apModelUrl(name: string): string {
  const base = "https://www.audemarspiguet.com/com/en";
  const nameLower = name.toLowerCase();
  if (nameLower.includes("offshore")) return `${base}/collections/royal-oak-offshore.html`;
  if (nameLower.includes("royal oak")) return `${base}/collections/royal-oak.html`;
  if (nameLower.includes("concept")) return `${base}/collections/royal-oak-concept.html`;
  return `${base}/collections/royal-oak.html`;
}

/** Cartier: collection page (official uses /en-us/{collection}.html). */
function cartierModelUrl(name: string): string {
  const base = "https://www.cartier.com/en-us";
  const nameLower = name.toLowerCase();
  if (nameLower.includes("santos")) return `${base}/santos.html`;
  if (nameLower.includes("tank")) return `${base}/tank.html`;
  if (nameLower.includes("panthère") || nameLower.includes("panthere")) return `${base}/panthere.html`;
  if (nameLower.includes("ballon")) return `${base}/ballon-bleu.html`;
  if (nameLower.includes("pasha")) return `${base}/pasha.html`;
  if (nameLower.includes("ronde")) return `${base}/ronde.html`;
  if (nameLower.includes("clé") || nameLower.includes("cle")) return `${base}/cle-de-cartier.html`;
  if (nameLower.includes("drive")) return `${base}/drive-de-cartier.html`;
  return "https://www.cartier.com/en-us/watches.html";
}

/** Richard Mille: /collections/{slug} e.g. rm-037-automatic. Ref RM035 → rm-035. */
function richardMilleModelUrl(reference: string): string {
  const base = "https://www.richardmille.com/collections";
  const slug = reference.toLowerCase().replace(/\s/g, "").replace(/^rm/, "rm-");
  return `${base}/${slug}`;
}

/** Omega: /en-us/watches/{collection}. */
function omegaModelUrl(name: string): string {
  const base = "https://www.omega.com/en-us/watches";
  const nameLower = name.toLowerCase();
  if (nameLower.includes("speedmaster")) return `${base}/speedmaster`;
  if (nameLower.includes("seamaster")) return `${base}/seamaster`;
  if (nameLower.includes("constellation")) return `${base}/constellation`;
  if (nameLower.includes("planet ocean")) return `${base}/planet-ocean`;
  return `${base}`;
}

/** Tudor, IWC, Panerai, etc.: collection or brand. */
function tudorModelUrl(name: string): string {
  const base = "https://www.tudorwatch.com/en/watches";
  const nameLower = name.toLowerCase();
  if (nameLower.includes("black bay")) return `${base}/black-bay`;
  if (nameLower.includes("pelagos")) return `${base}/pelagos`;
  if (nameLower.includes("royal")) return `${base}/royal`;
  return "https://www.tudorwatch.com";
}

/**
 * Returns the official URL for this specific watch model when possible,
 * otherwise the brand's main site (from getOfficialBenchmarkUrl).
 */
export function getOfficialModelUrl(
  brand: string,
  reference: string | null,
  name: string
): string | null {
  const ref = (reference || "").trim();
  const fallback = getOfficialBenchmarkUrl(brand);

  switch (brand) {
    case "Rolex":
      return ref ? rolexModelUrl(ref, name) : fallback ?? null;
    case "Patek Philippe":
      return ref ? patekModelUrl(ref, name) : fallback ?? null;
    case "Audemars Piguet":
      return apModelUrl(name);
    case "Cartier":
      return cartierModelUrl(name);
    case "Richard Mille":
      return ref ? richardMilleModelUrl(ref) : fallback ?? null;
    case "Omega":
      return omegaModelUrl(name);
    case "Tudor":
      return tudorModelUrl(name);
    default:
      return fallback;
  }
}
