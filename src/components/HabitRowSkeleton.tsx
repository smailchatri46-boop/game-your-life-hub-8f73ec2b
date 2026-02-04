import { Skeleton } from "@/components/ui/skeleton";

interface HabitRowSkeletonProps {
  daysInMonth: number;
}

export function HabitRowSkeleton({ daysInMonth }: HabitRowSkeletonProps) {
  return (
    <tr className="border-t border-border/30 animate-pulse">
      <td className="p-1.5 lg:p-2">
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-3 h-3 rounded" />
          <Skeleton className="w-6 h-6 rounded-lg" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </td>
      {Array.from({ length: daysInMonth }, (_, i) => (
        <td key={i} className="p-0.5 lg:p-1 text-center">
          <Skeleton className="w-5 h-5 lg:w-6 lg:h-6 rounded-full mx-auto" />
        </td>
      ))}
      <td className="p-1 lg:p-2 text-right">
        <Skeleton className="h-4 w-8 ml-auto" />
      </td>
      <td>
        <Skeleton className="w-6 h-6 rounded" />
      </td>
    </tr>
  );
}
