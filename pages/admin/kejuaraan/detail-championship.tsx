"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ArrowLeft, MapPin, Calendar, Trophy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Championship {
  id: number;
  name: string;
  level: "kota" | "provinsi" | "nasional" | "internasional";
  location: string;
  start_date: string;
  end_date: string;
}

const levelOptions: Record<string, string> = {
  kota: "Kota",
  provinsi: "Provinsi",
  nasional: "Nasional",
  internasional: "Internasional",
};

const levelColors: Record<string, string> = {
  kota: "bg-blue-100 text-blue-800",
  kabupaten: "bg-green-100 text-green-800",
  provinsi: "bg-yellow-100 text-yellow-800",
  nasional: "bg-orange-100 text-orange-800",
  internasional: "bg-red-100 text-red-800",
};

export default function ChampionshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [championship, setChampionship] = useState<Championship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (!id) return;

    const fetchChampionship = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${BASE_URL}/api/admin/get/championship/${id}`,
        );
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Kejuaraan tidak ditemukan");
          }
          throw new Error("Gagal memuat detail kejuaraan");
        }
        const result = await response.json();
        setChampionship(result.data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchChampionship();
  }, [id, BASE_URL]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: localeId });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="gap-2 -ml-2"
        onClick={() => router.push("/admin/kejuaraan")}
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Kejuaraan
      </Button>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/4" />
          <Card>
            <CardContent className="p-6 space-y-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-red-600 font-medium">Error</p>
            <p className="text-sm text-gray-600">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/admin/kejuaraan")}
            >
              Kembali ke Daftar
            </Button>
          </CardContent>
        </Card>
      ) : championship ? (
        <>
          {/* Title & Level */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight">
                {championship.name}
              </h1>
              <Badge
                className={`text-sm px-3 py-1 shrink-0 ${levelColors[championship.level]}`}
              >
                {levelOptions[championship.level]}
              </Badge>
            </div>
          </div>

          {/* Detail Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                Informasi Kejuaraan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Lokasi</p>
                  <p className="text-base font-semibold">
                    {championship.location}
                  </p>
                </div>
              </div>

              <div className="border-t" />

              {/* Dates */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                <div className="grid grid-cols-2 gap-6 w-full">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Tanggal Mulai
                    </p>
                    <p className="text-base font-semibold">
                      {formatDate(championship.start_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Tanggal Akhir
                    </p>
                    <p className="text-base font-semibold">
                      {formatDate(championship.end_date)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
