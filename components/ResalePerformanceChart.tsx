"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export type PerformanceItem = {
  watch: { id: string; name: string; brand: string; reference?: string | null };
  yoyPercent: number;
};

const CHART_COLOR_BEST = "hsl(var(--accent))";
const CHART_COLOR_WORST = "hsl(0 84% 60%)"; // red

function formatPercent(v: number): string {
  const n = Math.round(v * 10) / 10;
  if (n > 0) return `+${n}%`;
  if (n < 0) return `${n}%`;
  return "0%";
}

export default function ResalePerformanceChart({
  data,
  variant = "best",
  metricLabel = "YoY",
}: {
  data: PerformanceItem[];
  variant?: "best" | "worst";
  metricLabel?: string;
}) {
  const chartData = data
    .map(({ watch, yoyPercent }) => {
      const num = typeof yoyPercent === "number" && !Number.isNaN(yoyPercent) ? yoyPercent : 0;
      const baseLabel = watch.name ?? "";
      const fullLabel = watch.reference ? `${baseLabel} · ${watch.reference}` : baseLabel;
      return {
        id: watch.id,
        name: fullLabel,
        fullName: fullLabel,
        yoyPercent: Math.round(num * 10) / 10,
      };
    })
    .filter((d) => d.id);

  if (chartData.length === 0) return null;

  const isWorst = variant === "worst";
  const color = isWorst ? CHART_COLOR_WORST : CHART_COLOR_BEST;

  // Ensure domain has visible spread so bars render (Recharts can collapse to [0,0] when all same)
  const values = chartData.map((d) => d.yoyPercent);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const spread = Math.max(5, (dataMax - dataMin) || 5);
  const domainMin = Math.min(dataMin - spread * 0.2, 0);
  const domainMax = Math.max(dataMax + spread * 0.2, 0);
  const domain: [number, number] = [domainMin, domainMax];

  return (
    <div className="w-full">
      <div className="h-[420px] min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis
              type="number"
              dataKey="yoyPercent"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(v) => formatPercent(v)}
              domain={domain}
              width={50}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              width={200}
              tick={{ fill: "hsl(var(--foreground))" }}
              interval={0}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [formatPercent(value), metricLabel]}
              labelFormatter={(_, payload) =>
                (payload?.[0]?.payload?.fullName as string) ?? ""
              }
            />
            <Bar dataKey="yoyPercent" radius={[0, 4, 4, 0]} minPointSize={6}>
              {chartData.map((entry) => (
                <Cell key={entry.id} fill={color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
        One bar per watch (average YoY across years).{" "}
        {isWorst
          ? "Models decreasing or not increasing in price consistently."
          : "Models increasing in price consistently."}{" "}
        <Link href="/watches" className="text-[hsl(var(--accent))] hover:underline">
          Open Watches
        </Link>{" "}
        to click through to each model.
      </p>
    </div>
  );
}
