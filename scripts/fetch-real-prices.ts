/**
 * Fetches real aftermarket price history from TheWatchAPI (api.thewatchapi.com).
 * Requires THEWATCHAPI_API_TOKEN (Standard plan or above for reference/price/history).
 * Prices are indicative market prices in USD from online listings.
 */

const API_BASE = "https://api.thewatchapi.com/v1";

/** Normalize our reference for API (e.g. 5711/1A-010 → 5711 for Patek). */
function normalizeRefForApi(ref: string, brand: string): string {
  const r = ref.trim();
  if (brand === "Patek Philippe" && r.includes("/")) return r.split("/")[0]!;
  if (brand === "Richard Mille" && r.includes("-")) return r.split("-")[0]!;
  return r;
}

export type WatchRow = { wid: string; ref: string; name: string; brand: string; msrpCents: number };

export async function fetchReferencePriceHistory(
  apiToken: string,
  ref: string,
  brand: string
): Promise<{ date: string; price: number }[]> {
  const refNorm = normalizeRefForApi(ref, brand);
  const url = `${API_BASE}/reference/price/history?reference_number=${encodeURIComponent(refNorm)}&date_from=2022-01-01&date_to=2024-12-31&api_token=${encodeURIComponent(apiToken)}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 403) throw new Error("Price history requires Standard plan or above.");
    if (res.status === 402) throw new Error("Usage limit reached.");
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API ${res.status}`);
  }
  const json = (await res.json()) as { data?: { date: string; price: number }[] };
  return json.data ?? [];
}

/** Pick one price per year (use latest available in that year). */
export function samplePricesByYear(
  history: { date: string; price: number }[]
): { 2022: number; 2023: number; 2024: number } | null {
  const byYear: Record<string, { date: string; price: number }> = {};
  for (const entry of history) {
    const y = entry.date.slice(0, 4);
    if (y !== "2022" && y !== "2023" && y !== "2024") continue;
    const cur = byYear[y];
    if (!cur || entry.date > cur.date) byYear[y] = entry;
  }
  if (byYear["2022"] && byYear["2023"] && byYear["2024"])
    return {
      2022: byYear["2022"].price,
      2023: byYear["2023"].price,
      2024: byYear["2024"].price,
    };
  return null;
}

export async function fetchAllRealPrices(
  watches: WatchRow[],
  apiToken: string,
  onProgress?: (current: number, total: number, ref: string) => void
): Promise<Map<string, { 2022: number; 2023: number; 2024: number }>> {
  const out = new Map<string, { 2022: number; 2023: number; 2024: number }>();
  for (let i = 0; i < watches.length; i++) {
    const { wid, ref, brand } = watches[i]!;
    onProgress?.(i + 1, watches.length, ref);
    try {
      const history = await fetchReferencePriceHistory(apiToken, ref, brand);
      const sampled = samplePricesByYear(history);
      if (sampled) out.set(wid, sampled);
    } catch (e) {
      console.warn(`Skip ${ref} (${brand}):`, (e as Error).message);
    }
    await new Promise((r) => setTimeout(r, 400)); // respect rate limits
  }
  return out;
}
