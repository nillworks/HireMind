const SeekerProfileSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6 space-y-4">
          <div className="h-5 w-32 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
          <div className="h-20 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export default SeekerProfileSkeleton;
