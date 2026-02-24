import { SectionCards } from "@/components/client/admin/section-cards";

const BASE_URL = process.env.BASE_URL;

async function getDashboardData() {
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

    const [
      userJson,
      beltJson,
      statsJson,
      championship5yJson,
      championship3mJson,
    ] = await Promise.all([
      userRes.json().catch(() => null),
      beltRes.json().catch(() => null),
      statRes.json().catch(() => null),
      championship5yRes.json().catch(() => null),
      championship3mRes.json().catch(() => null),
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
