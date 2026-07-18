const ManageUsersSkeleton = () => {
  const rows = Array.from({ length: 8 });

  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-36 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-64 rounded-lg bg-gray-200 dark:bg-gray-700 mt-2" />
      </div>

      <div className="h-10 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden">
        <div className="p-4 space-y-4">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
          {rows.map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="size-9 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-48 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-8 w-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUsersSkeleton;
