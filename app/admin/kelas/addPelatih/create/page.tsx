import { Suspense } from "react";
import AddTrainersClient from "@/components/client/admin/AddTrainersClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddTrainersClient />
    </Suspense>
  );
}
