// components\server\admin\chart-area-interactive-server.tsx
import { ChartAreaInteractive } from "@/components/client/admin/chart-area-interactive";

interface ChartDataItem {
  period: string;
  muridAktif: number;
  totalMurid: number;
}

interface ChartAllData {
  "7days": ChartDataItem[];
  "1month": ChartDataItem[];
  "3months": ChartDataItem[];
}

async function getChartAllData(): Promise<ChartAllData | null> {
  try {
    const BASE_URL = process.env.BASE_URL;

    if (!BASE_URL) {
      console.error(
        "Missing BASE_URL. Set NEXT_PUBLIC_BASE_URL (or BASE_URL) in env.",
      );
      return null;
    }

    const res = await fetch(`${BASE_URL}/api/admin/get/user/chart/all`, {
      // default Next bisa cache; untuk data chart admin biasanya dynamic
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
