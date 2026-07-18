const MyJobsSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-Border dark:bg-secondary rounded-lg" />
          <div className="h-4 w-64 bg-Border dark:bg-secondary rounded" />
        </div>
        <div className="h-10 w-32 bg-Border dark:bg-secondary rounded-xl" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-10 flex-1 bg-Border dark:bg-secondary rounded-xl" />
        <div className="h-10 w-36 bg-Border dark:bg-secondary rounded-xl" />
        <div className="h-10 w-36 bg-Border dark:bg-secondary rounded-xl" />
        <div className="h-10 w-36 bg-Border dark:bg-secondary rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-Border dark:bg-secondary rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-Border dark:bg-secondary rounded" />
                  <div className="h-3 w-24 bg-Border dark:bg-secondary rounded" />
                </div>
              </div>
              <div className="h-6 w-16 bg-Border dark:bg-secondary rounded-full" />
            </div>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="h-3 w-20 bg-Border dark:bg-secondary rounded" />
                <div className="h-3 w-24 bg-Border dark:bg-secondary rounded" />
              </div>
              <div className="h-3 w-28 bg-Border dark:bg-secondary rounded" />
              <div className="h-3 w-36 bg-Border dark:bg-secondary rounded" />
              <div className="h-3 w-20 bg-Border dark:bg-secondary rounded" />
            </div>
            <div className="mt-4 pt-4 border-t border-Border dark:border-secondary flex gap-2">
              <div className="h-8 flex-1 bg-Border dark:bg-secondary rounded-lg" />
              <div className="h-8 flex-1 bg-Border dark:bg-secondary rounded-lg" />
              <div className="h-8 w-8 bg-Border dark:bg-secondary rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJobsSkeleton;
