import { Skeleton } from "./ui/skeleton";

const VideoCardSkeleton = () => {
  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border w-[300px]">
      {/* Thumbnail placeholder */}
      <Skeleton className="w-full h-[169px] rounded-t-xl" />

      <div className="p-3 space-y-3">
        {/* Title (2 lines) */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>

        {/* User section */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-[100px]" />
            <Skeleton className="h-3 w-[60px]" />
          </div>
        </div>

        {/* Stats (views + comments) */}
        <div className="flex items-center gap-6">
          <Skeleton className="h-4 w-[40px]" />
          <Skeleton className="h-4 w-[40px]" />
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
