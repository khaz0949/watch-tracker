import Link from "next/link";
import {
  TrendingUp,
  BarChart3,
  BookOpen,
  History,
  ChevronRight,
  Search,
} from "lucide-react";
import { getBrandLogoUrl, BRAND_LIST } from "@/lib/brands";
import { getDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Acquire Internal Dashboard Prototype — Prices, Demand & Resale",
  description:
    "Zayn, Sadiq and Zohayr's place for watch information, prices, demand, performance, and news. Built around the brands that dominate global demand and aftermarket sales.",
};

export default async function HomePage() {
  const data = await getDashboardData();
  const best = data?.bestPerforming ?? [];
  const topPreview = best.slice(0, 4);
  const totalWatches = data?.totalWatches ?? 0;

  return (
    <div className="space-y-14">
      {/* Hero — Chrono24-style strip */}
      <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-10 shadow-sm sm:px-10 sm:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
            Watch prices, demand & resale
          </h1>
          <p className="mt-3 text-[hsl(var(--muted-foreground))] sm:text-lg">
            Zayn, Sadiq and Zohayr&apos;s place for watch information, prices, demand, performance,
            and news. Built around the brands that dominate global demand and aftermarket sales.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/watches"
              className="inline-flex items-center rounded-lg bg-[hsl(var(--accent))] px-6 py-3 text-sm font-medium text-[hsl(var(--accent-foreground))] shadow-sm transition hover:bg-[hsl(var(--accent-hover))]"
            >
              Browse Watches
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg border-2 border-[hsl(var(--border))] bg-white px-6 py-3 text-sm font-medium text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
            >
              See Dashboard
            </Link>
          </div>
          <Link
            href="/watches"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-4 py-2.5 text-sm text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))]/50 hover:text-[hsl(var(--foreground))]"
          >
            <Search className="h-4 w-4" />
            Search all models
          </Link>
        </div>
      </section>

      {/* Brand strip — browse by brand */}
      <section>
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Browse by brand</h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Jump to watches from a specific brand.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {BRAND_LIST.map((brand) => (
            <Link
              key={brand}
              href={`/watches?brand=${encodeURIComponent(brand)}`}
              className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-3 shadow-sm transition hover:border-[hsl(var(--accent))] hover:shadow-md"
            >
              <img
                src={getBrandLogoUrl(brand)}
                alt={brand}
                className="h-8 w-8 rounded-lg object-contain bg-[hsl(var(--muted))]/30 p-1"
                referrerPolicy="no-referrer"
              />
              <span className="text-sm font-medium text-[hsl(var(--foreground))]">{brand}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Most in demand preview */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Most in demand</h2>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[hsl(var(--accent))] hover:underline"
          >
            View all on Dashboard
          </Link>
        </div>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Models increasing in price consistently (live data when available).
        </p>
        {topPreview.length > 0 ? (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topPreview.map((item) => {
              const w = item.watch as { id: string; name: string; brand: string; reference?: string | null };
              return (
                <li key={w.id}>
                  <Link
                    href={`/watches/${w.id}`}
                    className="block rounded-xl border border-[hsl(var(--border))] bg-white p-4 shadow-sm transition hover:border-[hsl(var(--accent))] hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={getBrandLogoUrl(w.brand)}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded object-contain bg-[hsl(var(--muted))]/30 p-1"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                          {w.brand}
                        </span>
                      </div>
                      {item.hasLiveData && (
                        <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-800">Live</span>
                      )}
                    </div>
                    <p className="mt-2 font-medium text-[hsl(var(--foreground))] line-clamp-2">
                      {w.name}
                      {w.reference ? ` · ${w.reference}` : ""}
                    </p>
                    <p className="mt-1 text-sm font-medium text-emerald-600">
                      +{item.yoyPercent.toFixed(1)}% avg YoY
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 p-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            No demand data yet. Run <code className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono">npm run db:seed</code> to load benchmark data; then &quot;Most in demand&quot; will appear here and on the dashboard.
          </p>
        )}
      </section>

      {/* Market insight tiles */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard"
          className="flex items-start gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm transition hover:border-[hsl(var(--accent))] hover:shadow-md"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent))]/10">
            <BarChart3 className="h-6 w-6 text-[hsl(var(--accent))]" />
          </div>
          <div>
            <h3 className="font-semibold text-[hsl(var(--foreground))]">Resale & retail vs Chrono24</h3>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Most in demand, least in demand, and retailer vs aftermarket comparison.
            </p>
            <span className="mt-2 inline-flex items-center text-sm font-medium text-[hsl(var(--accent))]">
              Open Dashboard
              <ChevronRight className="ml-0.5 h-4 w-4" />
            </span>
          </div>
        </Link>
        <Link
          href="/blog"
          className="flex items-start gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm transition hover:border-[hsl(var(--accent))] hover:shadow-md"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent))]/10">
            <BookOpen className="h-6 w-6 text-[hsl(var(--accent))]" />
          </div>
          <div>
            <h3 className="font-semibold text-[hsl(var(--foreground))]">Watch blog</h3>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Articles and guides from Chrono24 Magazine — brands, market trends, and lifestyle.
            </p>
            <span className="mt-2 inline-flex items-center text-sm font-medium text-[hsl(var(--accent))]">
              Read on Blog
              <ChevronRight className="ml-0.5 h-4 w-4" />
            </span>
          </div>
        </Link>
      </section>

      {/* Brand history teaser */}
      <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--muted))]/50">
              <History className="h-6 w-6 text-[hsl(var(--muted-foreground))]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Brand history & origins</h2>
              <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">
                Where each brand comes from, what they&apos;re known for, and where they sell — with links to official sites.
              </p>
            </div>
          </div>
          <Link
            href="/history"
            className="inline-flex items-center rounded-lg bg-[hsl(var(--accent))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--accent-foreground))] shadow-sm transition hover:bg-[hsl(var(--accent-hover))]"
          >
            View brand history
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* How it works — compact */}
      <section>
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">How it works</h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Each watch has a detail page with MSRP, launch date, price history, and retailer vs aftermarket.
          The dashboard ranks models by resale performance and compares retail vs Chrono24. We track{" "}
          <strong className="text-[hsl(var(--foreground))]">{totalWatches || "…"} models</strong> across the
          best-selling brands aftermarket.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/watches"
            className="text-sm font-medium text-[hsl(var(--accent))] hover:underline"
          >
            Browse all watches →
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[hsl(var(--accent))] hover:underline"
          >
            Open dashboard →
          </Link>
        </div>
      </section>
    </div>
  );
}
