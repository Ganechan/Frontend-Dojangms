import { Button } from "@/components/ui/button";
import { SearchX, AlertTriangle } from "lucide-react";

export function KelasEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold">Tidak ada kelas ditemukan</h3>
      <p className="max-w-sm text-sm text-muted-foreground text-pretty">
        Coba ubah kata kunci pencarian atau filter yang digunakan.
      </p>
    </div>
  );
}

export function KelasErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold">Gagal memuat data kelas</h3>
      <p className="max-w-sm text-sm text-muted-foreground text-pretty">
        Silakan coba beberapa saat lagi.
      </p>
      <Button onClick={onRetry} variant="outline" className="mt-1">
        Coba Lagi
      </Button>
    </div>
  );
}
