import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getBrandLogoUrl } from "@/lib/brands";

const CHRONO24_MAGAZINE_URL = "https://www.chrono24.ae/magazine/";

export const metadata = {
  title: "Blog — Acquire Internal Dashboard Prototype",
  description: "Watch news, guides, and articles from Chrono24 Magazine.",
};

const FEATURED_ARTICLES = [
  {
    title: "7 Reasons Why We Love TAG Heuer",
    href: "https://www.chrono24.ae/magazine/7-reasons-why-we-love-tag-heuer-p_172486/",
    category: "Watch Brands",
    readTime: "5 min",
  },
  {
    title: "Spring Watches For Him And Her",
    href: "https://www.chrono24.ae/magazine/spring-watches-for-him-and-her-p_172462/",
    category: "Lifestyle",
    readTime: "4 min",
  },
  {
    title: "Top 5 Vintage Omega Watches on Chrono24",
    href: "https://www.chrono24.ae/magazine/top-5-vintage-omega-watches-on-chrono24-p_172307/",
    category: "Watch market",
    readTime: "4 min",
  },
  {
    title: "Long-Term Review: Omega Seamaster Diver 300M",
    href: "https://www.chrono24.ae/magazine/long-term-review-my-experience-with-the-omega-seamaster-diver-300m-p_172236/",
    category: "Omega",
    readTime: "5 min",
  },
  {
    title: "Top 10 Swiss Watch Brands at a Glance",
    href: "https://www.chrono24.ae/magazine/the-top-10-swiss-watch-brands-p_112425/",
    category: "Top 10 Watches",
    readTime: "9 min",
  },
  {
    title: "The Top 10 Best Watches Under $2,000",
    href: "https://www.chrono24.ae/magazine/10-best-watches-under-2000-p_129458/",
    category: "Top 10 Watches",
    readTime: "6 min",
  },
  {
    title: "Top 10 Best Watch Brands of All Time",
    href: "https://www.chrono24.ae/magazine/the-top-10-watch-brands-of-all-time-p_107724/",
    category: "Top 10 Watches",
    readTime: "5 min",
  },
];

function getArticleBrand(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("tag heuer")) return "TAG Heuer";
  if (t.includes("omega")) return "Omega";
  if (t.includes("swiss watch brands")) return "Omega"; // generic Swiss brands – use Omega as a neutral Swiss anchor
  return null;
}

export default function BlogPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "How it works", href: "/" },
          { label: "Blog" },
        ]}
      />
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
          Watch blog
        </h1>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">
          Articles, guides, and news from{" "}
          <a
            href={CHRONO24_MAGAZINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[hsl(var(--accent))] hover:underline"
          >
            Chrono24 Magazine
          </a>
          —your source for watch culture, market insights, and brand stories.
        </p>
      </div>

      <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <BookOpen className="h-12 w-12 text-[hsl(var(--accent))]" />
          <h2 className="mt-4 text-lg font-semibold text-[hsl(var(--foreground))]">
            Read on Chrono24 Magazine
          </h2>
          <p className="mt-2 max-w-lg text-sm text-[hsl(var(--muted-foreground))]">
            Chrono24 Magazine covers watch brands, collecting, market trends, and lifestyle. Open the
            magazine to browse all articles, videos, and guides.
          </p>
          <a
            href={CHRONO24_MAGAZINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-5 py-2.5 text-sm font-medium text-[hsl(var(--accent-foreground))] shadow-sm transition hover:bg-[hsl(var(--accent-hover))]"
          >
            Open Chrono24 Magazine
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          Latest from Chrono24 Magazine
        </h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Featured articles—click to read on Chrono24.
        </p>
        <ul className="mt-4 space-y-3">
          {FEATURED_ARTICLES.map((article) => (
            <li key={article.href}>
              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-wrap items-center gap-3 rounded-lg border border-[hsl(var(--border))] bg-white p-4 shadow-sm transition hover:border-[hsl(var(--accent))] hover:shadow-md"
              >
                {(() => {
                  const brand = getArticleBrand(article.title);
                  if (!brand) return null;
                  const logo = getBrandLogoUrl(brand);
                  return (
                    <div className="mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[hsl(var(--muted))]/40 p-1.5">
                      <img
                        src={logo}
                        alt={brand}
                        className="h-full w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  );
                })()}
                <div className="min-w-0 flex-1">
                  <span className="block font-medium text-[hsl(var(--foreground))] truncate">
                    {article.title}
                  </span>
                  <span className="block text-xs text-[hsl(var(--muted-foreground))]">
                    {article.category} · {article.readTime}
                  </span>
                </div>
                <ExternalLink className="ml-auto h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">
          <a
            href={`${CHRONO24_MAGAZINE_URL}archive/`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[hsl(var(--accent))] hover:underline"
          >
            View all articles on Chrono24 Magazine →
          </a>
        </p>
      </section>
    </div>
  );
}
