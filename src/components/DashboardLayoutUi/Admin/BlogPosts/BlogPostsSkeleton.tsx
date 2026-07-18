const BlogPostsSkeleton = () => {
  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <div className="h-10 flex-1 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-20 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden"
          >
            <div className="h-40 w-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-4 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-4 w-2/3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="flex gap-1.5 pt-2">
                <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPostsSkeleton;
