// app/admin/user/page.tsx

import { Suspense } from "react";
import UserPageClient from "./UserPageClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[400px] w-full items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <UserPageClient />
    </Suspense>
  );
}
