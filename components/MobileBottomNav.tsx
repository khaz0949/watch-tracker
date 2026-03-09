"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Watch, BarChart3 } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/watches", label: "Watches", icon: Watch },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[hsl(var(--border))] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 md:hidden"
      aria-label="Mobile navigation"
    >
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 px-6 py-3 text-xs transition-colors ${
              active
                ? "text-[hsl(var(--accent))] font-medium"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
