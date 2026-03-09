import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />}
          {item.href ? (
            <Link href={item.href} className="hover:text-[hsl(var(--accent))] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[hsl(var(--foreground))]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
