// app/admin/user/edit/[id]/page.tsx

import { notFound } from "next/navigation";
import UserForm from "@/components/admin/user/user-form";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: "Edit User | Admin",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserApiResponse {
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
    tanggal_lahir: string;
    created_at: string;
    roles: ("admin" | "pelatih" | "murid")[];
    current_belt: {
      name: string;
      dan_level: number | null;
      achieved_at: string;
    } | null;
    belt_history: {
      name: string;
      dan_level: number | null;
      achieved_at: string;
      is_current: number;
    }[];
  };
}

interface EditUserPageProps {
  // Next.js 15: params adalah Promise
  params: Promise<{ id: string }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isoToDateInput(isoString: string): string {
  try {
    return new Date(isoString).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

// ─── Data Fetchers ────────────────────────────────────────────────────────────

async function getUser(id: string): Promise<UserApiResponse["data"] | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/get/user/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json: UserApiResponse = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

async function getBeltIdByName(beltName: string): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/api/public/get/belt`, {
      cache: "force-cache",
    });
    const json = await res.json();
    const belts: { id: number; name: string }[] = json.data ?? [];
    const match = belts.find((b) => b.name === beltName);
    return match ? String(match.id) : "";
  } catch {
    return "";
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EditUserPage({ params }: EditUserPageProps) {
  // ✅ Next.js 15: await params sebelum mengakses propertinya
  const { id } = await params;

  const user = await getUser(id);

  if (!user) notFound();

  const belt_id = user.current_belt
    ? await getBeltIdByName(user.current_belt.name)
    : "";

  return (
    <UserForm
      mode="edit"
      userId={user.id}
      defaultValues={{
        name: user.name,
        email: user.email,
        phone: user.phone,
        tanggal_lahir: isoToDateInput(user.tanggal_lahir),
        roles: user.roles,
        belt_id,
        password: "",
      }}
    />
  );
}
