"use server";

import { revalidatePath } from "next/cache";

/**
 * Revalidate dashboard path untuk instant update setelah ada perubahan data
 * Gunakan function ini setelah:
 * - Admin menambah user/murid
 * - Ada registrasi user baru
 * - Update data sabuk atau kategori umur
 */
export async function revalidateDashboard() {
  try {
    // Revalidate halaman dashboard
    revalidatePath("/dashboard/admin");
    // Atau revalidate halaman spesifik lain jika perlu
    revalidatePath("/admin");

    return { success: true, message: "Dashboard cache berhasil di-update" };
  } catch (error) {
    console.error("Error revalidating dashboard:", error);
    return { success: false, message: "Gagal update cache" };
  }
}
