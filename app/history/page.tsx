import Breadcrumbs from "@/components/Breadcrumbs";
import { getBrandLogoUrl, getOfficialBenchmarkUrl } from "@/lib/brands";

export const metadata = {
  title: "Brand history & origins — Acquire Internal Dashboard Prototype",
  description:
    "High-level history and overview of the watch brands tracked in the dashboard, based on information from their official websites and press material.",
};

const section =
  "rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm";

function BrandHeading({ brand }: { brand: string }) {
  const logo = getBrandLogoUrl(brand);
  const officialUrl = getOfficialBenchmarkUrl(brand);
  return (
    <div className="flex items-center gap-2">
      <img
        src={logo}
        alt={brand}
        width={28}
        height={28}
        className="h-7 w-7 rounded bg-[hsl(var(--muted))]/40 p-1 object-contain"
        referrerPolicy="no-referrer"
      />
      {officialUrl ? (
        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))] transition-colors"
        >
          {brand}
        </a>
      ) : (
        <h2 className="text-lg font-semibold">{brand}</h2>
      )}
    </div>
  );
}

export default function BrandHistoryPage() {
  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "How it works", href: "/" },
          { label: "Brand history" },
        ]}
      />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Brand history & origins</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          A short overview of the major watch brands we track — where they come from, what
          they are known for, and how their collections are positioned. Summaries are based
          on information from each brand&apos;s official website and press material.
        </p>
      </header>

      <div className="space-y-6">
        <section className={section}>
          <BrandHeading brand="Rolex" />
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            Founded in 1905 in London and later established in Geneva, Rolex is widely
            regarded as the benchmark for modern luxury sports watches. The brand is known
            for pioneering waterproof Oyster cases, Perpetual automatic movements, and
            chronometer‑certified accuracy. Its core collections — including the Submariner,
            GMT‑Master II, Daytona, Datejust, Day‑Date, Explorer, Yacht‑Master and Sky‑Dweller
            — are positioned as robust everyday watches built for specific roles (diving,
            aviation, timing motorsport, calendar and travel functions) while remaining highly
            recognizable luxury objects.
          </p>
          <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
            Rolex has a global boutique and authorized dealer network, with especially strong
            demand in Europe, North America, China, Japan and the Middle East. In the UAE, stainless‑steel
            sports models at official retailers typically start in the tens of thousands of dirhams and
            rise into six‑figure AED territory for precious‑metal Day‑Date, Sky‑Dweller and gem‑set
            pieces, depending on configuration and availability. For official details and updates, see{" "}
            <a
              href="https://www.rolex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              rolex.com
            </a>
            .
          </p>
        </section>

        <section className={section}>
          <BrandHeading brand="Audemars Piguet" />
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            Audemars Piguet, founded in 1875 in Le Brassus, Switzerland, is an independent
            haute horlogerie manufacture best known today for the Royal Oak and Royal Oak
            Offshore collections. The Royal Oak, introduced in 1972, effectively created the
            category of the luxury stainless‑steel sports watch with an integrated bracelet
            and exposed bezel screws. AP continues to focus on high‑end complications,
            skeletonized movements, and bold designs through the Royal Oak, Royal Oak Offshore
            and Royal Oak Concept lines.
          </p>
          <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
            AP produces a relatively small number of watches compared with its visibility, with
            a boutique‑driven distribution model focused on Europe, the U.S., Greater China and
            key Middle Eastern markets. In the UAE, Royal Oak and Royal Oak Offshore models at
            official points of sale are generally priced from the high five‑figure to well into the
            six‑figure AED range, depending on size, material and complication. See{" "}
            <a
              href="https://www.audemarspiguet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              audemarspiguet.com
            </a>{" "}
            for AP&apos;s own collection overview and boutiques.
          </p>
        </section>

        <section className={section}>
          <BrandHeading brand="Patek Philippe" />
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            Patek Philippe, established in Geneva in 1839, is one of the oldest and most
            prestigious Swiss manufactures, known for hand‑finished movements, refined case
            designs and complicated timepieces. The brand&apos;s main families include the
            Nautilus and Aquanaut (sporty, integrated‑bracelet designs), the Calatrava
            (classical dress watches), and a long list of Grand Complications such as
            perpetual calendars, minute repeaters and world time watches. Patek positions
            its watches as long‑term heirlooms, often highlighting generational ownership in
            its communications.
          </p>
          <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
            Patek Philippe is distributed through a small network of salons and authorized
            retailers concentrated in Europe, North America, East Asia and the Middle East.
            In the UAE, Aquanaut and Nautilus references at authorized retailers are typically
            priced from the low six‑figure AED range upwards, with Grand Complication pieces
            and precious‑metal Calatrava or complications extending far higher depending on
            materials and complexity. Official collection information and boutique locations
            are published on{" "}
            <a
              href="https://www.patek.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              patek.com
            </a>
            .
          </p>
        </section>

        <section className={section}>
          <BrandHeading brand="Cartier" />
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            Cartier began in 1847 in Paris as a jeweller and has become one of the most
            recognizable names in both high jewelry and watchmaking. Rather than focusing on
            tool watches, Cartier emphasizes design, shapes and dials: icons like the Santos,
            Tank, Ballon Bleu, Pasha, Panthère and Tortue come from its long history of
            shaped cases and elegant Roman‑numeral dials. Collections span from everyday
            steel models to precious‑metal and high‑jewelry interpretations, often pairing
            in‑house movements with strong design language.
          </p>
          <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
            As a global luxury maison, Cartier operates its own boutiques and shop‑in‑shops in
            major cities worldwide. In the UAE and wider GCC, Santos, Tank and Ballon Bleu
            models in steel and two‑tone configurations generally start in the mid five‑figure
            AED range at Cartier boutiques, with high‑jewelry and precious‑metal pieces
            extending significantly beyond that. Current collections and boutique information
            are available on{" "}
            <a
              href="https://www.cartier.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              cartier.com
            </a>
            .
          </p>
        </section>

        <section className={section}>
          <BrandHeading brand="Richard Mille" />
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            Richard Mille is a much younger brand, launched in 2001, but has quickly become
            synonymous with ultra‑high‑end, technical sports watches. Drawing heavily on
            motorsport and aerospace materials, the brand is known for tonneau‑shaped cases
            in titanium and advanced composites, visible movements, and extreme shock‑ and
            stress‑testing (for example in partnership with Formula 1 drivers and tennis
            players). Collections such as the RM 011, RM 027, RM 035 and RM 67 emphasize
            skeletonized movements, innovative tourbillons and very limited production.
          </p>
          <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
            Richard Mille operates through a very small number of mono‑brand boutiques and
            select partners, with strong presence in Europe, the U.S., Asia and luxury hubs
            like Dubai. In the UAE, RM references are typically priced in the high six‑figure
            to multi‑million AED range at official points of sale, depending on case material,
            complication and edition size. Official information on models and boutiques is
            published at{" "}
            <a
              href="https://www.richardmille.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              richardmille.com
            </a>
            .
          </p>
        </section>

        <section className={section}>
          <h2 className="text-lg font-semibold">Other tracked brands</h2>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            Beyond the core five brands above, the dashboard also tracks a wide set of other
            manufacturers that dominate global trading and enthusiast interest — including
            Omega, Tudor, TAG Heuer, Grand Seiko, Panerai, Hublot, IWC, Breitling, Vacheron
            Constantin, A. Lange &amp; Söhne, Jaeger‑LeCoultre, Breguet, Chopard, Bulgari,
            Seiko, Citizen, Casio, Nomos Glashütte and Glashütte Original. Their official
            websites and museum or heritage sections are the primary sources for positioning,
            collection structure and historical milestones; this app focuses on how their key
            modern references behave in retail and aftermarket pricing.
          </p>
          <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
            For each maison, the primary reference point is the brand&apos;s own official
            website (for example{" "}
            <a
              href="https://www.omegawatches.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              omegawatches.com
            </a>
            ,{" "}
            <a
              href="https://www.tagheuer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              tagheuer.com
            </a>
            ,{" "}
            <a
              href="https://www.seikowatches.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              seikowatches.com
            </a>
            ,{" "}
            <a
              href="https://www.iwc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              iwc.com
            </a>{" "}
            and the official sites of the other brands), which provides the most up‑to‑date
            collection and boutique information.
          </p>
          <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
            In practice, many of these brands have particularly strong followings in specific
            regions — for example Omega, TAG Heuer and Breitling across Europe and the Middle
            East; Grand Seiko and Seiko in Japan and Asia; and Vacheron Constantin, Jaeger‑LeCoultre
            and A. Lange &amp; Söhne among collectors in Europe, North America and the Gulf.
            In the UAE, entry points for steel sports and dress models from these maisons often
            start in the low to mid five‑figure AED range at official boutiques, with high
            complications, precious metals and gem‑set pieces scaling up from there.
          </p>
        </section>
      </div>
    </div>
  );
}

