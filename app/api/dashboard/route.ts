import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getDashboardData();
    if (!data) {
      return NextResponse.json(
        { error: "Failed to fetch dashboard" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      totalWatches: data.totalWatches,
      recentPrices: data.recentPrices,
      bestPerforming: data.bestPerforming,
      worstPerforming: data.worstPerforming,
      retailVsChrono24: data.retailVsChrono24,
      dataSource: data.dataSource,
      performanceMetric: data.performanceMetric,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch dashboard" },
      { status: 500 }
    );
  }
}
