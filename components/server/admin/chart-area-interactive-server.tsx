// components/server/admin/chart-area-interactive-server.tsx
import { ChartAreaInteractive } from "@/components/client/admin/chart-area-interactive";
import type { ChartAllData } from "@/types/dashboardAdmin";

async function getChartAllData(): Promise<ChartAllData | null> {
  const BASE_URL = process.env.BASE_URL;

  if (!BASE_URL) {
    console.error("Missing BASE_URL in environment variables.");
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/admin/get/user/chart/all`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch chart data:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    return (json?.data ?? null) as ChartAllData | null;
  } catch (e) {
    console.error("Failed to fetch chart data:", e);
    return null;
  }
}

export async function ChartAreaInteractiveServer() {
  const allData = await getChartAllData();
  return <ChartAreaInteractive allData={allData} />;
}
