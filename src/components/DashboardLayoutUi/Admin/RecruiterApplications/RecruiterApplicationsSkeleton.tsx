const RecruiterApplicationsSkeleton = () => {
  const rows = Array.from({ length: 4 });

  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-72 rounded-lg bg-gray-200 dark:bg-gray-700 mt-2" />
      </div>

      <div className="h-10 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />

      <div className="grid gap-4">
        {rows.map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] p-5 space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-56 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            <div className="h-3 w-48 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="flex gap-3">
              <div className="h-9 w-24 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="h-9 w-24 rounded-xl bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterApplicationsSkeleton;
