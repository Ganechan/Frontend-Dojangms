"use client";

import { useRouter } from "next/navigation";
import { SquarePen, KeyRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aksi Cepat</CardTitle>
        <CardDescription>Kelola akun dan keamanan Anda.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.push("/profile/edit")}
        >
          <SquarePen className="h-4 w-4" />
          Edit Profil
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.push("/profile/change-password")}
        >
          <KeyRound className="h-4 w-4" />
          Ubah Password
        </Button>
      </CardContent>
    </Card>
  );
}
