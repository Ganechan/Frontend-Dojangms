import { Mail, Phone, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/lib/profile/types";
import {
  getInitials,
  formatDate,
  formatValue,
} from "@/lib/profile/profile-utils";

function StatusBadge({ status }: { status: string }) {
  const isActive = status?.toLowerCase() === "active";
  return (
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
  );
}

function getAvatarUrl(foto: string | null): string | undefined {
  if (!foto) return undefined;
  if (foto.startsWith("http://") || foto.startsWith("https://")) {
    return foto;
  }
  return `/api/auth/avatar?path=${encodeURIComponent(foto)}`;
}

export function ProfileHeaderCard({ profile }: { profile: UserProfile }) {
  const avatarUrl = getAvatarUrl(profile.foto);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          {/* Left: avatar + identity */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left">
            <Avatar className="h-24 w-24 border shadow-sm">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={profile.name} />
              ) : null}
              <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center gap-2 sm:items-start">
              <h2 className="text-2xl font-semibold tracking-tight text-balance">
                {profile.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {profile.roles?.map((role) => (
                  <Badge key={role} className="capitalize">
                    {role}
                  </Badge>
                ))}
                <StatusBadge status={profile.status} />
              </div>
            </div>
          </div>

          {/* Right: contact info */}
          <div className="w-full md:w-auto">
            <Separator className="my-2 md:hidden" />
            <dl className="grid gap-3 text-sm md:text-right">
              <div className="flex items-center justify-center gap-2 md:justify-end">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <dd className="text-foreground">
                  {formatValue(profile.email)}
                </dd>
              </div>
              <div className="flex items-center justify-center gap-2 md:justify-end">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <dd className="text-foreground">
                  {formatValue(profile.phone)}
                </dd>
              </div>
              <div className="flex items-center justify-center gap-2 md:justify-end">
                <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                <dd className="text-muted-foreground">
                  Bergabung {formatDate(profile.created_at)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
