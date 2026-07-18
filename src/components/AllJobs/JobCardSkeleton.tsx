const JobCardSkeleton = () => {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden">
      <div className="h-1 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="size-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-1/2 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default JobCardSkeleton;
