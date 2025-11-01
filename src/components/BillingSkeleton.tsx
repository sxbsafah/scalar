import { Skeleton } from "@/components/ui/skeleton";

export default function BillingSkeleton() {
  return (
    <>
      <div className="bg-card p-6 rounded-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-[30px] w-[30px] rounded-full" />
          <Skeleton className="h-8 w-[220px]" />
        </div>
        <Skeleton className="h-5 w-[260px] mb-6" />

        {/* Plan + Status Section */}
        <div className="bg-muted px-8 py-6 rounded-xl shadow-xl mb-8">
          <div className="flex justify-between mb-6">
            <div>
              <Skeleton className="h-5 w-[80px] mb-2" />
              <Skeleton className="h-6 w-[100px]" />
            </div>
            <div className="text-right">
              <Skeleton className="h-5 w-[80px] mb-2 ml-auto" />
              <Skeleton className="h-6 w-[100px] ml-auto" />
            </div>
          </div>

          {/* Next Billing Date */}
          <div className="mb-8">
            <Skeleton className="h-5 w-[150px] mb-2" />
            <Skeleton className="h-6 w-[200px]" />
          </div>

          {/* Cancellation Alert */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-[24px] w-[24px] rounded-full" />
            <Skeleton className="h-5 w-[350px]" />
          </div>
        </div>

        {/* Manage Billing Button */}
        <div className="w-fit ml-auto">
          <Skeleton className="h-10 w-[180px] rounded-md" />
        </div>
      </div>
    </>
  );
}