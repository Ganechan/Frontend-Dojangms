import type { Metadata } from "next";
import { JadwalSayaView } from "@/components/murid/jadwal/jadwal-view";

export const metadata: Metadata = {
  title: "Jadwal Saya | Portal Siswa Taekwondo",
  description: "Lihat seluruh jadwal latihan yang terdaftar pada kelas Anda.",
};

export default function JadwalSayaPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <header className="mb-8 flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Jadwal Saya
        </h1>
        <p className="text-sm text-muted-foreground text-pretty sm:text-base">
          Lihat seluruh jadwal latihan yang terdaftar pada kelas Anda.
        </p>
      </header>

      <JadwalSayaView />
    </main>
  );
}
