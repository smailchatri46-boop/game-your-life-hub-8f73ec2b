import { Skeleton } from "@/components/ui/skeleton";

export function TodoSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div 
          key={i}
          className="flex items-center gap-3 p-3 rounded-2xl bg-white/80"
        >
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      ))}
    </div>
  );
}
