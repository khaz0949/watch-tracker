/**
 * MSRP benchmark and aftermarket multipliers.
 * MSRP: benchmark range from Rolex.com and official brand/retailer sites (reliable retail reference).
 * Multipliers: fallback when no live Chrono24 data; aftermarket / MSRP (2022–2024).
 */

/** MSRP in USD from Rolex.com / official sites / AD benchmarks. Others fall back to watch-models. */
export const MSRP_OVERRIDES: Record<string, number> = {
  "126610LN": 10400,
  "126610LV": 10400,
  "124060": 9100,
  "126500LN": 15500,
  "126503": 22250, // Oystersteel & yellow gold (two-tone), ~$22,250
  "126710BLRO": 10700,
  "126710BLNR": 10700,
  "226570": 10600,
  "5711/1A-010": 33230,
  "5712/1A-001": 40230,
  "5167A-001": 22400,
  "15500ST": 22500,
  "16202ST": 33500,
  "WSSA0019": 7300,
  "WSTA0042": 2850,
  "W69012Z4": 6050,
};

/** Market segment for aftermarket behaviour (2022 peak, 2023–24 cooling). */
export type Segment =
  | "rolex_sports"
  | "rolex_classic"
  | "ap_royal_oak"
  | "patek_nautilus"
  | "patek_aquanaut"
  | "patek_other"
  | "cartier"
  | "richard_mille"
  | "other";

/**
 * Aftermarket / MSRP by year. Based on reported grey market vs retail (2022 peak, 2023–24 correction).
 * e.g. 1.45 = 45% above retail.
 */
export const AFTERMARKET_BY_YEAR: Record<Segment, { 2022: number; 2023: number; 2024: number }> = {
  rolex_sports: { 2022: 1.48, 2023: 1.35, 2024: 1.22 },   // Sub, GMT, Daytona, Explorer, YM, SD, Deepsea — cooling
  rolex_classic: { 2022: 1.08, 2023: 1.02, 2024: 0.98 },  // Datejust, Day-Date, OP, Sky-Dweller — at or below
  ap_royal_oak: { 2022: 2.05, 2023: 1.82, 2024: 1.68 },   // RO/ROO — high premium, cooling
  patek_nautilus: { 2022: 3.95, 2023: 3.15, 2024: 2.68 }, // 5711/5712 etc — peak then sharp correction
  patek_aquanaut: { 2022: 2.85, 2023: 2.55, 2024: 2.35 }, // Aquanaut — strong but below Nautilus
  patek_other: { 2022: 1.18, 2023: 1.12, 2024: 1.08 },    // Calatrava, complications
  cartier: { 2022: 0.98, 2023: 0.97, 2024: 0.96 },       // typically at or slightly below retail
  richard_mille: { 2022: 1.12, 2023: 1.08, 2024: 1.05 }, // RM — small premium, limited discount
  other: { 2022: 1.0, 2023: 0.98, 2024: 0.97 },          // Chrono24 browse brands (neutral)
};

/** Map brand + reference/name to segment for multiplier lookup. */
export function getSegment(brand: string, ref: string, name: string): Segment {
  const r = ref.toUpperCase();
  const n = name.toLowerCase();

  if (brand === "Rolex") {
    if (
      /12(66|24|65|27|26|25)|22(6|4)|13(66)|1164/.test(r) ||
      n.includes("submariner") ||
      n.includes("daytona") ||
      n.includes("gmt") ||
      n.includes("explorer") ||
      n.includes("yacht") ||
      n.includes("sea-dweller") ||
      n.includes("deepsea") ||
      n.includes("air-king") ||
      n.includes("milgauss")
    )
      return "rolex_sports";
    return "rolex_classic";
  }
  if (brand === "Audemars Piguet") return "ap_royal_oak";
  if (brand === "Patek Philippe") {
    if (n.includes("nautilus") || /5711|5712|5980|5726|5740|5990|7118|7010/.test(r)) return "patek_nautilus";
    if (n.includes("aquanaut") || /5167|5168|5164|5968|5267/.test(r)) return "patek_aquanaut";
    return "patek_other";
  }
  if (brand === "Cartier") return "cartier";
  if (brand === "Richard Mille") return "richard_mille";
  return "other"; // Chrono24 browse brands (TAG Heuer, Omega, Panerai, etc.)
}

export function getMsrpOverride(ref: string): number | undefined {
  return MSRP_OVERRIDES[ref] ?? MSRP_OVERRIDES[ref.replace(/\s*\/\s*/g, "/")];
}
