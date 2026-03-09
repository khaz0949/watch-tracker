# Data sources

## Live Chrono24 prices (recommended)

Aftermarket prices and performance are tracked from **Chrono24** via the [Retailed.io](https://www.retailed.io/) API (live listing data).

- **Setup:** Get an API key from [Retailed.io](https://app.retailed.io/), then set `RETAILED_API_KEY` in your environment.
- **Refresh:** Run `npm run refresh-chrono24` to fetch current Chrono24 prices for all models and save them to the DB. Run this on a schedule (e.g. daily cron) so performance and Retail vs Chrono24 stay up to date.
- **Cron:** You can also call `GET /api/cron/refresh-chrono24` (optionally with `?secret=YOUR_CRON_SECRET` if `CRON_SECRET` is set) to refresh from a cron job.

MSRP is **not** taken from Chrono24; it uses the benchmark range from official sources (see below).

## MSRP & launch dates (confirmed / benchmark)

MSRP and launch dates are **confirmed against official or widely cited sources**:

- **Rolex:** US retail benchmarks (Rolex does not publish list prices; we use commonly cited AD figures). Launch dates from press (e.g. Submariner 41 ref. 126610LN Sept 2020, GMT 126710 BLRO 2018 / BLNR 2019, Daytona 126500LN 2023).
- **Patek Philippe, Audemars Piguet, Cartier, Richard Mille:** Official or boutique/AD list prices and model introduction dates where published.
- **Other brands:** Official sites, press, and retailer benchmarks.

**Where values live:** `scripts/watch-models.ts` (base MSRP and launch per model), `scripts/realistic-prices.ts` (`MSRP_OVERRIDES` for key references that override the base). These feed “Retail” and “Retail vs Chrono24” on the dashboard.

**Verifying:** On each watch detail page, a "Verify at official site" link goes to the **specific watch model** on the brand’s site when possible (Rolex, Patek, AP, Cartier, Richard Mille, Omega, Tudor); otherwise it falls back to the brand homepage. Logic lives in `lib/official-model-urls.ts` (`getOfficialModelUrl`). Brand homepages are in `lib/brands.ts` → `BRAND_OFFICIAL_URL`.

## Other data options

- **TheWatchAPI:** If `THEWATCHAPI_API_TOKEN` is set, the **seed** can fetch historical reference-level prices (Standard plan+). Good for initial history; for ongoing live data use Chrono24 via Retailed above.
- **Fallback:** If no live refresh has run, the app uses benchmark multipliers in `scripts/realistic-prices.ts` for aftermarket (not live).

## Summary

| Source | What it is | When used |
|--------|------------|-----------|
| **Chrono24 (Retailed.io)** | Live listing prices from Chrono24 | When you run `refresh-chrono24` or call the cron endpoint |
| **Rolex.com / official sites** | MSRP benchmark range | For all “Retail” and “Retail vs Chrono24” |
| TheWatchAPI | Historical market prices | Optional at seed when token set |
| realistic-prices.ts | MSRP overrides + benchmark multipliers | Retail always; aftermarket only when no live data |
