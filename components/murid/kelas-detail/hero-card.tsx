import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatTanggal } from "@/types/murid/format";
import type { KelasDetail } from "@/types/murid/kelas";

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

interface HeroCardProps {
  kelas: Pick<
    KelasDetail,
    "nama" | "deskripsi" | "status" | "tanggal_bergabung"
  >;
}

export function HeroCard({ kelas }: HeroCardProps) {
  const isAktif = kelas.status === "aktif";

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Informasi Kelas</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          <Field label="Nama Kelas">
            <span className="font-medium">{kelas.nama}</span>
          </Field>
          <Field label="Status">
            <Badge
              variant="secondary"
              className={cn(
                "font-medium",
                isAktif
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isAktif ? "Aktif" : "Nonaktif"}
            </Badge>
          </Field>
          <Field label="Tanggal Bergabung">
            {formatTanggal(kelas.tanggal_bergabung)}
          </Field>
          <Field label="Deskripsi">
            <span className="leading-relaxed text-muted-foreground">
              {kelas.deskripsi}
            </span>
          </Field>
        </dl>
      </CardContent>
    </Card>
  );
}

export function HeroCardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
