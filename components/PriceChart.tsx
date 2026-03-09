"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatPrice } from "@/lib/utils";

type Point = { year: string; retailer?: number; aftermarket?: number; label?: string };

export default function PriceChart({ data }: { data: Point[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="year"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            tickFormatter={(v) => (v >= 100 ? `$${(v / 100).toLocaleString()}` : "")}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [formatPrice(value), ""]}
            labelFormatter={(label) => `Year: ${label}`}
          />
          <Legend
            formatter={(value) => (
              <span className="text-sm text-[hsl(var(--foreground))]">{value}</span>
            )}
          />
          {data.some((d) => d.retailer != null) && (
            <Line
              type="monotone"
              dataKey="retailer"
              name="Retail"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--accent))" }}
              connectNulls
            />
          )}
          {data.some((d) => d.aftermarket != null) && (
            <Line
              type="monotone"
              dataKey="aftermarket"
              name="Aftermarket"
              stroke="hsl(142 76% 36%)"
              strokeWidth={2}
              dot={{ fill: "hsl(142 76% 36%)" }}
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
