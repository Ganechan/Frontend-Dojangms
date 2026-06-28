import {
  User,
  Mail,
  Phone,
  Users,
  Cake,
  MapPin,
  Shield,
  Activity,
  Clock,
  RefreshCw,
  UserCheck,
  PhoneCall,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/lib/profile/types";
import {
  formatValue,
  formatDate,
  formatDateTime,
  formatGender,
} from "@/lib/profile/profile-utils";

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-medium text-foreground break-words">
          {children}
        </dd>
      </div>
    </div>
  );
}

export function ProfileInformation({ profile }: { profile: UserProfile }) {
  const isActive = profile.status?.toLowerCase() === "active";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Profil</CardTitle>
        <CardDescription>
          Detail lengkap data akun dan profil Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-8 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 sm:[&>*:nth-child(odd)]:border-r sm:[&>*]:border-b sm:[&>*]:border-border">
          <InfoRow icon={User} label="Nama Lengkap">
            {formatValue(profile.name)}
          </InfoRow>
          <InfoRow icon={Mail} label="Email">
            {formatValue(profile.email)}
          </InfoRow>
          <InfoRow icon={Phone} label="Nomor HP">
            {formatValue(profile.phone)}
          </InfoRow>
          <InfoRow icon={Users} label="Jenis Kelamin">
            {formatGender(profile.jenis_kelamin)}
          </InfoRow>
          <InfoRow icon={Cake} label="Tanggal Lahir">
            {formatDate(profile.tanggal_lahir)}
          </InfoRow>
          <InfoRow icon={MapPin} label="Alamat">
            {formatValue(profile.alamat)}
          </InfoRow>
          <InfoRow icon={UserCheck} label="Nama Wali">
            {formatValue(profile.nama_wali)}
          </InfoRow>
          <InfoRow icon={PhoneCall} label="Nomor Wali">
            {formatValue(profile.no_wali)}
          </InfoRow>
          <InfoRow icon={Shield} label="Role">
            <div className="flex flex-wrap gap-1.5">
              {profile.roles?.length ? (
                profile.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="capitalize">
                    {role}
                  </Badge>
                ))
              ) : (
                <span>-</span>
              )}
            </div>
          </InfoRow>
          <InfoRow icon={Activity} label="Status">
            <Badge
              variant="outline"
              className={
                isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400"
                  : "border-border bg-muted text-muted-foreground"
              }
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </InfoRow>
          <InfoRow icon={Clock} label="Created At">
            {formatDateTime(profile.created_at)}
          </InfoRow>
          <InfoRow icon={RefreshCw} label="Updated At">
            {formatDateTime(profile.updated_at)}
          </InfoRow>
        </dl>
      </CardContent>
    </Card>
  );
}
