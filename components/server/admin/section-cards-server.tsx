// components/server/admin/section-cards-server.tsx
import { SectionCards } from "@/components/client/admin/section-cards";
import type { DashboardData } from "@/types/dashboardAdmin";

async function getDashboardData(): Promise<DashboardData | null> {
  // ✅ FIX: BASE_URL dipindah ke dalam fungsi (konsisten dengan file server lainnya)
  const BASE_URL = process.env.BASE_URL;

  if (!BASE_URL) {
    console.error("Missing BASE_URL in environment variables.");
    return null;
  }

  try {
    const [userRes, beltRes, statRes, championship5yRes, championship3mRes] =
      await Promise.all([
        fetch(`${BASE_URL}/api/admin/get/user/all`, {
          next: { revalidate: 60 },
        }),
        fetch(`${BASE_URL}/api/admin/get/championship`, {
          next: { revalidate: 60 },
        }),
        fetch(`${BASE_URL}/api/admin/get/user/stats`, {
          next: { revalidate: 60 },
        }),
        fetch(`${BASE_URL}/api/admin/get/championship/5years`, {
          next: { revalidate: 60 },
        }),
        fetch(`${BASE_URL}/api/admin/get/championship/3months`, {
          next: { revalidate: 60 },
        }),
      ]);

    // ✅ FIX: Cek res.ok sebelum .json() — konsisten dengan chart-area-interactive-server.tsx
    const safeJson = async (res: Response) => {
      if (!res.ok) {
        console.error(
          `Fetch failed: ${res.url} — ${res.status} ${res.statusText}`,
        );
        return null;
      }
      return res.json().catch(() => null);
    };

    const [
      userJson,
      beltJson,
      statsJson,
      championship5yJson,
      championship3mJson,
    ] = await Promise.all([
      safeJson(userRes),
      safeJson(beltRes),
      safeJson(statRes),
      safeJson(championship5yRes),
      safeJson(championship3mRes),
    ]);

    return {
      userJson,
      beltJson,
      statsJson,
      championship5yJson,
      championship3mJson,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

export async function SectionCardsServer() {
  const data = await getDashboardData();
  return <SectionCards data={data} />;
}
