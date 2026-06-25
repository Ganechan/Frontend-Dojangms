import { Suspense } from "react";
import AddPesertaClient from "@/components/client/admin/add-peserta-client";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddPesertaClient />
    </Suspense>
  );
}
