export interface Belt {
  name: string;
  dan_level: string | null;
  achieved_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  current_belt: Belt;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiError {
  message: string;
}

// ── Register ──────────────────────────────────────────────────────────────────

export interface BeltOption {
  id: number;
  name: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string; // format: +62xxxxxxx
  tanggal_lahir: string; // format: YYYY-MM-DD
  belt_id: number | null;
}

export interface RegisterResponse {
  message: string;
}
