"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials } from "@/lib/profile/profile-utils";

interface EditPhotoCardProps {
  previewUrl: string | null;
  name: string;
  disabled?: boolean;
  onSelectFile: (file: File) => void;
}

// Fungsi helper untuk mendapatkan URL avatar
function getAvatarUrl(foto: string | null): string | undefined {
  if (!foto) return undefined;
  // URL absolut (dari backend atau eksternal)
  if (foto.startsWith("http://") || foto.startsWith("https://")) {
    return foto;
  }
  // Blob URL (preview file baru)
  if (foto.startsWith("blob:")) {
    return foto;
  }
  // Path relatif dari backend (misal uploads/users/xxx.jpg) -> gunakan proxy internal
  return `/api/auth/avatar?path=${encodeURIComponent(foto)}`;
}

export function EditPhotoCard({
  previewUrl,
  name,
  disabled,
  onSelectFile,
}: EditPhotoCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onSelectFile(file);
    // Reset value agar memilih file yang sama bisa trigger change lagi
    e.target.value = "";
  }

  const avatarUrl = previewUrl ? getAvatarUrl(previewUrl) : null;

  return (
    <Card className="rounded-xl overflow-hidden shadow-sm border">
      <CardHeader className="bg-muted/30 border-b pt-5 pb-4 px-6">
        <CardTitle className="text-lg font-semibold">Foto Profil</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <Avatar className="h-32 w-32 border">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
          ) : null}
          <AvatarFallback className="text-2xl">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Pilih Foto
        </Button>

        <p className="text-center text-xs text-muted-foreground leading-relaxed">
          JPG, JPEG atau PNG
          <br />
          Maksimal 2 MB.
        </p>
      </CardContent>
    </Card>
  );
}
