import { Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { UserProfile } from "@/lib/profile/types";
import {
  calculateCompleteness,
  COMPLETENESS_FIELDS,
  isEmpty,
} from "@/lib/profile/profile-utils";

const FIELD_LABELS: Record<string, string> = {
  foto: "Foto Profil",
  alamat: "Alamat",
  jenis_kelamin: "Jenis Kelamin",
  nama_wali: "Nama Wali",
  no_wali: "Nomor Wali",
  phone: "Nomor HP",
  tanggal_lahir: "Tanggal Lahir",
};

export function CompletenessCard({ profile }: { profile: UserProfile }) {
  const { percent, completed, total } = calculateCompleteness(profile);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kelengkapan Profil</CardTitle>
        <CardDescription>
          {completed} dari {total} data telah dilengkapi.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold tabular-nums">
              {percent}%
            </span>
            <span className="text-sm text-muted-foreground">Selesai</span>
          </div>
          <Progress value={percent} className="h-2" />
        </div>

        <ul className="space-y-2">
          {COMPLETENESS_FIELDS.map((field) => {
            const filled = !isEmpty(profile[field]);
            return (
              <li
                key={field}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {FIELD_LABELS[field]}
                </span>
                {filled ? (
                  <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                    <Check className="h-4 w-4" />
                    Lengkap
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-medium text-muted-foreground">
                    <X className="h-4 w-4" />
                    Kosong
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
