"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, TriangleAlert, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DetailHeader, DetailHeaderSkeleton } from "./detail-header";
import { HeroCard, HeroCardSkeleton } from "./hero-card";
import { StatCards, StatCardsSkeleton } from "./stat-cards";
import { JadwalSection, JadwalSectionSkeleton } from "./jadwal-section";
import {
  KehadiranSection,
  KehadiranSectionSkeleton,
} from "./kehadiran-section";
import { RiwayatSection, RiwayatSectionSkeleton } from "./riwayat-section";
import type { KelasDetail } from "@/types/murid/kelas";

const API_BASE = "/api/murid/kelas";

function DetailLoading() {
  return (
    <div className="flex flex-col gap-8">
      <DetailHeaderSkeleton />
      <HeroCardSkeleton />
      <StatCardsSkeleton />
      <JadwalSectionSkeleton />
      <KehadiranSectionSkeleton />
      <RiwayatSectionSkeleton />
    </div>
  );
}

function DetailError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kelas Saya
      </Link>
      <Card className="shadow-sm">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
            <TriangleAlert
              className="h-7 w-7 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold">
              Gagal memuat detail kelas
            </h2>
            <p className="text-sm text-muted-foreground">
              Silakan coba kembali beberapa saat lagi.
            </p>
          </div>
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Map response API ke tipe KelasDetail
 */
function mapApiToKelasDetail(apiData: any): KelasDetail {
  const kelas = apiData.kelas || {};
  const jadwalList = apiData.jadwal || [];
  const absensi = apiData.absensi || { riwayat: [], statistik: {} };

  return {
    id: kelas.id,
    nama: kelas.nama,
    deskripsi: kelas.deskripsi,
    status: kelas.status,
    tanggal_bergabung: kelas.tanggal_bergabung || kelas.created_at || "",
    jumlah_murid_aktif: kelas.jumlah_murid_aktif || 0,
    jumlah_pelatih_aktif: kelas.jumlah_pelatih_aktif || 0,
    jadwal: jadwalList.map((j: any) => ({
      id: j.id,
      jadwal_nama: j.jadwal_nama || j.nama || "",
      hari: j.hari,
      jam_mulai: j.jam_mulai,
      jam_selesai: j.jam_selesai,
      lokasi: j.lokasi,
      effective_from: j.effective_from,
      effective_until: j.effective_until,
      tanggal_mulai: j.tanggal_mulai,
      tanggal_selesai: j.tanggal_selesai,
    })),
    absensi: {
      riwayat: (absensi.riwayat || []).map((r: any) => ({
        absensi_id: r.absensi_id || r.id,
        tanggal: r.tanggal,
        jadwal_id: r.jadwal_id,
        jadwal_nama: r.jadwal_nama,
        hari: r.hari,
        jam_mulai: r.jam_mulai,
        jam_selesai: r.jam_selesai,
        status: r.status,
        catatan: r.catatan,
        waktu_absen: r.waktu_absen || r.created_at,
      })),
      statistik: {
        total_pertemuan: absensi.statistik.total_pertemuan || 0,
        hadir: absensi.statistik.hadir || 0,
        izin: absensi.statistik.izin || 0,
        sakit: absensi.statistik.sakit || 0,
        alpha: absensi.statistik.alpha || 0,
        persentase_kehadiran: absensi.statistik.persentase_kehadiran || 0,
      },
    },
  };
}

export function KelasDetailView({ kelasId }: { kelasId: string }) {
  const [detail, setDetail] = useState<KelasDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchDetail = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setIsError(false);

    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(kelasId)}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message || `Request failed with status ${res.status}`,
        );
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Gagal memuat data");
      }
      const mapped = mapApiToKelasDetail(json.data);
      setDetail(mapped);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setIsError(true);
      setDetail(null);
    } finally {
      setIsLoading(false);
    }
  }, [kelasId]);

  useEffect(() => {
    fetchDetail();
    return () => abortRef.current?.abort();
  }, [fetchDetail]);

  if (isError) return <DetailError onRetry={fetchDetail} />;
  if (isLoading || !detail) return <DetailLoading />;

  return (
    <div className="flex flex-col gap-8">
      <DetailHeader
        nama={detail.nama}
        status={detail.status}
        tanggalBergabung={detail.tanggal_bergabung}
      />
      <HeroCard kelas={detail} />
      <StatCards
        statistik={{
          muridAktif: detail.jumlah_murid_aktif,
          pelatihAktif: detail.jumlah_pelatih_aktif,
          totalJadwal: detail.jadwal.length,
          persentaseKehadiran: detail.absensi.statistik.persentase_kehadiran,
        }}
      />
      <JadwalSection jadwal={detail.jadwal} />
      <KehadiranSection statistik={detail.absensi.statistik} />
      <RiwayatSection riwayat={detail.absensi.riwayat} />
    </div>
  );
}
