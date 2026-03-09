/**
 * Live Chrono24 price data via Retailed.io API.
 * https://docs.retailed.io/v1/api-reference/chrono24/search
 * Requires RETAILED_API_KEY (x-api-key). Prices returned in USD.
 */

const RETAILED_BASE = "https://app.retailed.io/api/v1/scraper/chrono24/search";
const RETAILED_USAGE = "https://app.retailed.io/api/v1/usage";

/** Trim and strip surrounding quotes so .env or shell doesn't break the key. */
export function sanitizeRetailedKey(key: string | undefined): string {
  if (key == null) return "";
  const s = String(key).trim();
  if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1).trim();
  if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1).trim();
  return s;
}

/** Call Retailed usage endpoint to verify the API key. */
export async function verifyRetailedKey(apiKey: string): Promise<{ ok: boolean; error?: string }> {
  const key = sanitizeRetailedKey(apiKey);
  if (!key || key === "your_key" || key.toLowerCase().includes("your_")) {
    return { ok: false, error: "Use your real API key from https://app.retailed.io (API Keys). Do not use the placeholder 'your_key'." };
  }
  const res = await fetch(RETAILED_USAGE, { headers: { "x-api-key": key } });
  if (res.ok) return { ok: true };
  const err = await res.json().catch(() => ({}));
  const msg = (err as { message?: string }).message || (res.status === 401 ? "Invalid API key. Check it at https://app.retailed.io and try: curl -H \"x-api-key: YOUR_KEY\" https://app.retailed.io/api/v1/usage" : `API ${res.status}`);
  return { ok: false, error: msg };
}

export type Chrono24PriceStats = {
  lowestPriceUsd: number;
  medianPriceUsd: number;
  averagePriceUsd: number;
  highestPriceUsd: number;
  totalResults: number;
};

function parsePriceStats(raw: unknown): Chrono24PriceStats | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const stats = (o.stats ?? o.price_stats ?? o) as Record<string, unknown>;
  const priceStats = (stats.price_stats ?? stats) as Record<string, unknown>;
  const low = Number(priceStats.lowest_price ?? priceStats.lowest);
  const mid = Number(priceStats.median_price ?? priceStats.median ?? priceStats.medianPrice);
  const avg = Number(priceStats.average_price ?? priceStats.average ?? priceStats.averagePrice);
  const high = Number(priceStats.highest_price ?? priceStats.highest ?? priceStats.highestPrice);
  const total = Number(stats.total_results ?? stats.totalResults ?? 0);
  if (!Number.isFinite(mid) && !Number.isFinite(avg)) return null;
  return {
    lowestPriceUsd: Number.isFinite(low) ? low : 0,
    medianPriceUsd: Number.isFinite(mid) ? mid : avg,
    averagePriceUsd: Number.isFinite(avg) ? avg : mid,
    highestPriceUsd: Number.isFinite(high) ? high : 0,
    totalResults: Number.isFinite(total) ? total : 0,
  };
}

/**
 * Fetch current Chrono24 listing price stats for a watch (brand + reference).
 * Uses median price as the canonical "live" price when available.
 * apiKey is sanitized (trimmed, quotes stripped) before use.
 */
export async function fetchChrono24PriceStats(
  apiKey: string,
  brand: string,
  reference: string
): Promise<Chrono24PriceStats | null> {
  const key = sanitizeRetailedKey(apiKey);
  const query = `${brand} ${reference}`.trim();
  const url = `${RETAILED_BASE}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { "x-api-key": key, "Content-Type": "application/json" },
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(
        "Invalid Retailed API key. Get a key at https://app.retailed.io (API Keys). Test with: curl -H \"x-api-key: YOUR_KEY\" https://app.retailed.io/api/v1/usage"
      );
    }
    if (res.status === 402) throw new Error("Retailed usage limit reached.");
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `Chrono24 API ${res.status}`);
  }
  const json = (await res.json()) as unknown;
  return parsePriceStats(json);
}
