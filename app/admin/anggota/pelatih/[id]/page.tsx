import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, Award, Users } from "lucide-react";

interface CoachData {
  id: number;
  name: string;
  email: string;
  phone: string;
  jenis_kelamin: string;
  tanggal_lahir: string;
  tanggal_bergabung: string;
  status: string;
  pelatih: {
    spesialisasi: string | null;
    sertifikasi: string | null;
  };
  sabuk_saat_ini: {
    id: number;
    name: string;
  };
  kelas_diampu: string[];
  total_murid: number;
  foto: string | null;
  alamat: string | null;
}

interface ApiResponse {
  message: string;
  data: CoachData[];
}

async function getCoach(id: string): Promise<CoachData | null> {
  try {
    const response = await fetch("http://localhost:3000/api/coaches", {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result: ApiResponse = await response.json();
    const coach = result.data.find((c) => c.id === parseInt(id));
    return coach || null;
  } catch (error) {
    console.error("Error fetching coach:", error);
    return null;
  }
}

export const metadata = {
  title: "Detail Pelatih | Admin Dashboard",
  description: "Lihat detail informasi pelatih",
};

export default async function CoachDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coach = await getCoach(id);

  if (!coach) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/coaches">
            <Button variant="ghost" className="gap-2 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Pelatih
            </Button>
          </Link>
          <div className="text-center">
            <p className="text-red-600 font-semibold">
              Pelatih tidak ditemukan
            </p>
          </div>
        </div>
      </main>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <Link href="/coaches">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Pelatih
          </Button>
        </Link>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Card Informasi Dasar */}
          <Card className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {coach.name}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {coach.jenis_kelamin === "laki-laki"
                    ? "Pelatih Laki-laki"
                    : "Pelatih Perempuan"}
                </p>
              </div>
              <Badge className={getStatusColor(coach.status)}>
                {coach.status === "active" ? "Aktif" : coach.status}
              </Badge>
            </div>

            {/* Grid Informasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                  Email
                </p>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <a
                    href={`mailto:${coach.email}`}
                    className="text-foreground hover:text-primary transition"
                  >
                    {coach.email}
                  </a>
                </div>
              </div>

              {/* Telepon */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                  Nomor Telepon
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <a
                    href={`tel:${coach.phone}`}
                    className="text-foreground hover:text-primary transition"
                  >
                    {coach.phone}
                  </a>
                </div>
              </div>

              {/* Tanggal Lahir */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                  Tanggal Lahir
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-foreground">
                    {formatDate(coach.tanggal_lahir)}
                  </span>
                </div>
              </div>

              {/* Tanggal Bergabung */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                  Tanggal Bergabung
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-foreground">
                    {formatDate(coach.tanggal_bergabung)}
                  </span>
                </div>
              </div>
            </div>

            {/* Alamat */}
            {coach.alamat && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                  Alamat
                </p>
                <p className="text-foreground">{coach.alamat}</p>
              </div>
            )}
          </Card>

          {/* Card Informasi Keahlian */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Informasi Keahlian
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sabuk */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                  Sabuk Saat Ini
                </p>
                <Badge className="bg-primary text-primary-foreground text-base py-2 px-4">
                  {coach.sabuk_saat_ini.name}
                </Badge>
              </div>

              {/* Spesialisasi */}
              {coach.pelatih.spesialisasi && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                    Spesialisasi
                  </p>
                  <p className="text-foreground">
                    {coach.pelatih.spesialisasi}
                  </p>
                </div>
              )}

              {/* Sertifikasi */}
              {coach.pelatih.sertifikasi && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                    Sertifikasi
                  </p>
                  <p className="text-foreground">{coach.pelatih.sertifikasi}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Card Statistik Kelas dan Murid */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Statistik Mengajar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Kelas */}
              <div className="p-6 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="h-6 w-6 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-600 uppercase">
                    Total Kelas
                  </p>
                </div>
                <p className="text-4xl font-bold text-blue-600">
                  {coach.kelas_diampu.length}
                </p>
              </div>

              {/* Total Murid */}
              <div className="p-6 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                  <p className="text-sm font-semibold text-green-600 uppercase">
                    Total Murid
                  </p>
                </div>
                <p className="text-4xl font-bold text-green-600">
                  {coach.total_murid}
                </p>
              </div>
            </div>
          </Card>

          {/* Card Daftar Kelas */}
          {coach.kelas_diampu.length > 0 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Daftar Kelas yang Diampu
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {coach.kelas_diampu.map((kelas, index) => (
                  <div
                    key={index}
                    className="p-4 bg-secondary rounded-lg border border-border"
                  >
                    <p className="text-foreground font-medium">{kelas}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
