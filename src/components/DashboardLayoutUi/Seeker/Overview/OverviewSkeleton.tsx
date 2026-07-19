const OverviewSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-72 bg-Border dark:bg-secondary rounded-lg" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5"
          >
            <div className="h-10 w-10 bg-Border dark:bg-secondary rounded-xl" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-24 bg-Border dark:bg-secondary rounded" />
              <div className="h-8 w-16 bg-Border dark:bg-secondary rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
          <div className="h-5 w-36 bg-Border dark:bg-secondary rounded mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-Border dark:bg-secondary rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
          <div className="h-5 w-28 bg-Border dark:bg-secondary rounded mb-5" />
          <div className="flex items-center gap-4 mb-5">
            <div className="size-16 bg-Border dark:bg-secondary rounded-full" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-Border dark:bg-secondary rounded" />
              <div className="h-3 w-24 bg-Border dark:bg-secondary rounded" />
            </div>
          </div>
          <div className="h-24 bg-Border dark:bg-secondary rounded-xl" />
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <div className="h-5 w-44 bg-Border dark:bg-secondary rounded mb-5" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="size-6 bg-Border dark:bg-secondary rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-Border dark:bg-secondary rounded" />
                <div className="h-3 w-32 bg-Border dark:bg-secondary rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewSkeleton;
