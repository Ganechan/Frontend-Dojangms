// lib\profile\types.ts
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  foto: string | null;
  alamat: string | null;
  jenis_kelamin: string | null;
  nama_wali: string | null;
  no_wali: string | null;
  tanggal_lahir: string | null;
  status: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}
