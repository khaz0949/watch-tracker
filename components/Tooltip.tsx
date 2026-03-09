"use client";

import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

export default function Tooltip({
  text,
  children,
}: {
  text: string;
  children?: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setVisible(false);
      }
    }
    if (visible) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible]);

  return (
    <span ref={ref} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="ml-1 inline-flex text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] transition-colors focus:outline-none"
        aria-label="More info"
      >
        {children ?? <HelpCircle className="h-3.5 w-3.5" />}
      </button>
      {visible && (
        <span
          className="absolute left-1/2 z-50 -translate-x-1/2 whitespace-normal rounded-lg bg-[hsl(var(--foreground))] px-2.5 py-1.5 text-xs text-white shadow-lg max-w-[240px] -top-2 -translate-y-full"
          role="tooltip"
        >
          {text}
        </span>
      )}
    </span>
  );
}
