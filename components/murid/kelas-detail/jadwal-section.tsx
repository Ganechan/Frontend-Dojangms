import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { JadwalLatihan } from "@/types/murid/kelas";

function JadwalCard({ jadwal }: { jadwal: JadwalLatihan }) {
  return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardHeader>
        <h3 className="text-base font-semibold leading-snug text-balance">
          {jadwal.nama}
        </h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5 text-sm">
          <Calendar
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="text-foreground">{jadwal.hari}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Clock
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="text-foreground">
            {jadwal.jamMulai} - {jadwal.jamSelesai}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <MapPin
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="text-foreground">{jadwal.lokasi}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function JadwalSection({ jadwal }: { jadwal: JadwalLatihan[] }) {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="jadwal-heading">
      <div className="flex flex-col gap-1">
        <h2
          id="jadwal-heading"
          className="text-lg font-semibold tracking-tight"
        >
          Jadwal Latihan
        </h2>
        <p className="text-sm text-muted-foreground">
          Jadwal latihan aktif untuk kelas ini.
        </p>
      </div>

      {jadwal.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Belum ada jadwal latihan untuk kelas ini.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {jadwal.map((item) => (
            <JadwalCard key={item.id} jadwal={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export function JadwalSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-5 w-44" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
