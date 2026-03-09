import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getBrandLogoUrl } from "@/lib/brands";

type Watch = {
  id: string;
  name: string;
  brand: string;
  reference: string | null;
  msrp: number | null;
  launchDate: string | null;
  imageUrl: string | null;
  hasLiveData?: boolean;
};

export default function WatchCard({ watch }: { watch: Watch }) {
  const logoUrl = getBrandLogoUrl(watch.brand);
  const imageUrl = watch.imageUrl || logoUrl;
  const showIndicativeNote = watch.hasLiveData !== true;

  return (
    <Link
      href={`/watches/${watch.id}`}
      className="group block overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-white shadow-sm transition-all duration-200 hover:border-[hsl(var(--accent))] hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[hsl(var(--muted))]/30">
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 p-1 shadow-sm">
            <img
              src={logoUrl}
              alt=""
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          {watch.hasLiveData && (
            <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
              Live
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[hsl(var(--foreground))] line-clamp-2 group-hover:text-[hsl(var(--accent))] transition-colors">
          {watch.name}
        </h3>
        <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">
          {watch.brand}
          {watch.reference ? ` · ${watch.reference}` : ""}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {watch.msrp != null && (
              <span className="rounded-md bg-[hsl(var(--muted))] px-2 py-0.5 text-xs font-medium">
                {formatPrice(watch.msrp)}
              </span>
            )}
            {watch.launchDate && (
              <span className="rounded-md bg-[hsl(var(--muted))] px-2 py-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                {watch.launchDate}
              </span>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform group-hover:translate-x-0.5 group-hover:text-[hsl(var(--accent))]" />
        </div>
        {showIndicativeNote && (
          <p className="mt-2 text-[10px] text-[hsl(var(--muted-foreground))] italic">
            Indicative data
          </p>
        )}
      </div>
    </Link>
  );
}
