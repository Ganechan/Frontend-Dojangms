import { SectionPieCharts } from "@/components/client/admin/pie-chart";

interface Belt {
  id: number;
  name: string;
  dan_level: number | null;
  order_level: number;
}

interface BeltPieItem {
  belt: string;
  totalMurid: number;
  percentage: number;
}

interface AgePieItem {
  kategoriUmur: string;
  rentang: string;
  totalMurid: number;
  percentage: number;
}

async function fetchData() {
  const BASE_URL = process.env.BASE_URL;

  const [beltRes, beltPieRes, agePieRes] = await Promise.all([
    fetch(`${BASE_URL}/api/public/get/belt`),
    fetch(`${BASE_URL}/api/admin/get/user/piechart/belt`),
    fetch(`${BASE_URL}/api/admin/get/user/piechart/age`),
  ]);

  const [beltResult, beltPieResult, agePieResult] = await Promise.all([
    beltRes.json(),
    beltPieRes.json(),
    agePieRes.json(),
  ]);

  const beltList: Belt[] = beltResult.data || [];
  const beltPieList: BeltPieItem[] = beltPieResult.data || [];
  const agePieList: AgePieItem[] = agePieResult.data || [];
  const totalBeltMurid: number = beltPieResult.totalMuridAktif || 0;
  const totalAgeMurid: number = agePieResult.totalMuridAktif || 0;

  // Urutkan belt sesuai order_level dari beltList
  const beltOrder = beltList.reduce<Record<string, number>>((acc, belt) => {
    acc[belt.name] = belt.order_level;
    return acc;
  }, {});

  const sortedBeltData = [...beltPieList]
    .sort((a, b) => (beltOrder[a.belt] ?? 999) - (beltOrder[b.belt] ?? 999))
    .map((item) => ({
      name: item.belt,
      value: item.totalMurid,
    }));

  const ageChartData = agePieList.map((item) => ({
    name: item.kategoriUmur,
    value: item.totalMurid,
  }));

  return {
    beltData: sortedBeltData,
    ageData: ageChartData,
    totalBeltMurid,
    totalAgeMurid,
  };
}

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

// ISR: Revalidate cache setiap 1 jam (3600 detik)
export const revalidate = 3600;
