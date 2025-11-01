import { Skeleton } from "@/components/ui/skeleton";

export default function NotifcationSkeleton() {
  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-xl p-3 shadow-2xs">
      <div className="flex gap-1.5 items-center">
        <Skeleton className="h-10 w-10 rounded-full" />

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-[180px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-[70px] rounded-md" />
        <Skeleton className="h-8 w-[70px] rounded-md" />
      </div>
    </div>
  );
}

