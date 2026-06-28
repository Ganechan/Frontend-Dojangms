import { AlertCircle, RotateCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function ProfileError({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Gagal Memuat Profil</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <span>Terjadi kesalahan saat mengambil data profil.</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" />
          Coba Lagi
        </Button>
      </AlertDescription>
    </Alert>
  );
}
