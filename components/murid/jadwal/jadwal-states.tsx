import { Button } from "@/components/ui/button";
import { CalendarX, AlertTriangle } from "lucide-react";

export function JadwalEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <CalendarX className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold">Tidak ada jadwal ditemukan</h3>
      <p className="max-w-sm text-sm text-muted-foreground text-pretty">
        Coba ubah pencarian atau filter yang digunakan.
      </p>
    </div>
  );
}

export function JadwalErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold">Gagal memuat jadwal</h3>
      <p className="max-w-sm text-sm text-muted-foreground text-pretty">
        Silakan coba kembali beberapa saat lagi.
      </p>
      <Button onClick={onRetry} variant="outline" className="mt-1">
        Coba Lagi
      </Button>
    </div>
  );
}
