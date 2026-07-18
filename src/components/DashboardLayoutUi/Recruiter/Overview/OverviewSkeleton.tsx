const OverviewSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-72 bg-Border dark:bg-secondary rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
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
    </div>
  );
};

export default OverviewSkeleton;
