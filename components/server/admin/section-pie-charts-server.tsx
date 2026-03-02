// components/server/admin/section-pie-charts-server.tsx
import { SectionPieCharts } from "@/components/client/admin/pie-chart";
import type {
  Belt,
  BeltPieItem,
  AgePieItem,
  ChartItem,
} from "@/types/dashboardAdmin";

async function fetchData(): Promise<{
  beltData: ChartItem[];
  ageData: ChartItem[];
  totalBeltMurid: number;
  totalAgeMurid: number;
}> {
  const BASE_URL = process.env.BASE_URL;

  if (!BASE_URL) {
    console.error("Missing BASE_URL in environment variables.");
    return { beltData: [], ageData: [], totalBeltMurid: 0, totalAgeMurid: 0 };
  }

  // ✅ FIX: Tambah res.ok check — konsisten dengan chart-area-interactive-server.tsx
  const safeJson = async (res: Response) => {
    if (!res.ok) {
      console.error(
        `Fetch failed: ${res.url} — ${res.status} ${res.statusText}`,
      );
      return null;
    }
    return res.json().catch(() => null);
  };

  try {
    const [beltRes, beltPieRes, agePieRes] = await Promise.all([
      fetch(`${BASE_URL}/api/public/get/belt`, {
        // ✅ FIX: Tambah cache config eksplisit — sebelumnya tidak ada
        next: { revalidate: 3600 },
      }),
      fetch(`${BASE_URL}/api/admin/get/user/piechart/belt`, {
        next: { revalidate: 3600 },
      }),
      fetch(`${BASE_URL}/api/admin/get/user/piechart/age`, {
        next: { revalidate: 3600 },
      }),
    ]);

    const [beltResult, beltPieResult, agePieResult] = await Promise.all([
      safeJson(beltRes),
      safeJson(beltPieRes),
      safeJson(agePieRes),
    ]);

    const beltList: Belt[] = beltResult?.data ?? [];
    const beltPieList: BeltPieItem[] = beltPieResult?.data ?? [];
    const agePieList: AgePieItem[] = agePieResult?.data ?? [];
    const totalBeltMurid: number = beltPieResult?.totalMuridAktif ?? 0;
    const totalAgeMurid: number = agePieResult?.totalMuridAktif ?? 0;

    const beltOrder = beltList.reduce<Record<string, number>>((acc, belt) => {
      acc[belt.name] = belt.order_level;
      return acc;
    }, {});

    const beltData: ChartItem[] = [...beltPieList]
      .sort((a, b) => (beltOrder[a.belt] ?? 999) - (beltOrder[b.belt] ?? 999))
      .map((item) => ({
        name: item.belt,
        value: item.totalMurid,
      }));

    const ageData: ChartItem[] = agePieList.map((item) => ({
      name: item.kategoriUmur,
      value: item.totalMurid,
    }));

    return { beltData, ageData, totalBeltMurid, totalAgeMurid };
  } catch (e) {
    console.error("Failed to fetch pie chart data:", e);
    return { beltData: [], ageData: [], totalBeltMurid: 0, totalAgeMurid: 0 };
  }
}

// ✅ FIX: Hapus export const revalidate = 3600 karena page menggunakan
// force-dynamic yang akan override revalidate ini — tidak ada efeknya.
// Cache per-fetch sudah diatur via next: { revalidate: 3600 } di atas.

export async function SectionPieChartsServer() {
  const { beltData, ageData, totalBeltMurid, totalAgeMurid } =
    await fetchData();

  return (
    <SectionPieCharts
      beltData={beltData}
      ageData={ageData}
      totalBeltMurid={totalBeltMurid}
      totalAgeMurid={totalAgeMurid}
    />
  );
}
