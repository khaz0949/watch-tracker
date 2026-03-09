import Link from "next/link";
import { Watch } from "lucide-react";
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
  const showIndicativeNote = watch.hasLiveData !== true;

  return (
    <Link
      href={`/watches/${watch.id}`}
      className="group block overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm transition hover:border-[hsl(var(--accent))] hover:shadow-md"
    >
      <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--muted))]/50 overflow-hidden p-1">
          <img
            src={logoUrl}
            alt=""
            className="h-full w-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate">{watch.name}</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] truncate">
            {watch.brand}
            {watch.reference ? ` · ${watch.reference}` : ""}
          </p>
        </div>
        <Watch className="h-5 w-5 shrink-0 text-[hsl(var(--muted-foreground))]" />
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {watch.msrp != null && (
            <span className="rounded bg-[hsl(var(--muted))] px-2 py-1">
              MSRP {formatPrice(watch.msrp)}
            </span>
          )}
          {watch.launchDate && (
            <span className="rounded bg-[hsl(var(--muted))] px-2 py-1">
              Launch {watch.launchDate}
            </span>
          )}
        </div>
        {showIndicativeNote && (
          <p className="mt-2 text-[10px] text-[hsl(var(--muted-foreground))] italic">
            Data is indicative, not live.
          </p>
        )}
      </div>
    </Link>
  );
}
