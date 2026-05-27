import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("bg-gray-200 animate-pulse rounded", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
      <Skeleton className="w-full pt-[100%]" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}
