const AnalyticsSkeleton = () => {
  const cardSkeletons = Array.from({ length: 4 });
  const chartSkeletons = Array.from({ length: 3 });

  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-36 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-64 rounded-lg bg-gray-200 dark:bg-gray-700 mt-2" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cardSkeletons.map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5"
          >
            <div className="flex items-start justify-between">
              <div className="size-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-8 w-14 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartSkeletons.slice(0, 2).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6"
          >
            <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 mb-6" />
            <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800" />
          </div>
        ))}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartSkeletons.slice(0, 2).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6"
          >
            <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700 mb-6" />
            <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800" />
          </div>
        ))}
      </div>

      {/* Chart Row 3 */}
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <div className="h-6 w-44 rounded bg-gray-200 dark:bg-gray-700 mb-6" />
        <div className="h-72 rounded-xl bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  );
};

export default AnalyticsSkeleton;
