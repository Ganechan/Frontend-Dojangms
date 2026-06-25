import { Suspense } from "react";
import AddStudentsClient from "@/components/client/admin/add-students-client";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddStudentsClient />
    </Suspense>
  );
}
