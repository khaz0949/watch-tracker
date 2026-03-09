"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "How it works" },
  { href: "/watches", label: "Watches" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "Brand history" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="hidden gap-6 text-sm md:flex">
        {links.map(({ href, label }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={
                active
                  ? "font-medium text-[hsl(var(--accent))]"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] transition-colors"
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-14 z-50 border-b border-[hsl(var(--border))] bg-white shadow-lg px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {links.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={
                    "rounded-lg px-3 py-2 transition-colors " +
                    (active
                      ? "bg-[hsl(var(--muted))] font-medium text-[hsl(var(--accent))]"
                      : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]")
                  }
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
