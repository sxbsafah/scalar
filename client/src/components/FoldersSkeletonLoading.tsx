import { Skeleton } from "./ui/skeleton";


const FoldersSkeletonLoading = () => {
  return (
    <div className="px-4 py-2 border border-border bg-card flex rounded-sm justify-between items-center w-[200px] relative overflow-hidden animate-pulse">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[100px]" /> {/* folder name */}
        <Skeleton className="h-3 w-[60px]" /> {/* videos count */}
      </div>
      <Skeleton className="w-5 h-5 rounded-full" /> {/* icon placeholder */}
      <div className="absolute blur-3xl w-[100px] h-[100px] bg-[#ddd] -top-[50px] -left-[50px] opacity-15 rounded-full"></div>
    </div>
  );
};

export default FoldersSkeletonLoading;
