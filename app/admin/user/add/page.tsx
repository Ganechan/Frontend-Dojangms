// app/admin/users/add/page.tsx

import UserForm from "@/pages/admin/user/user-form";

export const metadata = {
  title: "Tambah User | Admin",
};

export default function AddUserPage() {
  return <UserForm mode="add" />;
}
