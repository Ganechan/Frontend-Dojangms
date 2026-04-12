export type UserStatus = "active" | "inactive";

export interface Belt {
  id: number;
  name: string;
  dan_level: number | null;
  order_level: number;
}

export interface BeltApiResponse {
  message: string;
  data: Belt[];
}

export interface CreateMuridPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  tanggal_lahir: string;
  roles: ["murid"];
  status: UserStatus;
  belt_id: number;
}

export interface CreateMuridApiResponse {
  message: string;
}

// State lokal form — string semua karena berasal dari input HTML
export interface AddMuridFormState {
  name: string;
  email: string;
  password: string;
  phone: string;
  tanggal_lahir: string;
  status: UserStatus;
  belt_id: string;
}

export const INITIAL_ADD_MURID_FORM: AddMuridFormState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  tanggal_lahir: "",
  status: "active",
  belt_id: "",
};
