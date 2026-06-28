import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EditProfileSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr]">
      <Card className="rounded-xl overflow-hidden shadow-sm border">
        <CardHeader className="bg-muted/30 border-b pt-5 pb-4 px-6">
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-8 w-40" />
        </CardContent>
      </Card>

      <Card className="rounded-xl overflow-hidden shadow-sm border">
        <CardHeader className="bg-muted/30 border-b pt-5 pb-4 px-6">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="grid gap-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
