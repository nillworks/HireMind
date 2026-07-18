const SavedJobsSkeleton = () => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="h-10 w-48 rounded-xl bg-BorderLight dark:bg-secondary/20 animate-pulse" />
        <div className="h-10 w-64 rounded-xl bg-BorderLight dark:bg-secondary/20 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5 animate-pulse"
          >
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-BorderLight dark:bg-secondary/20" />

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-BorderLight dark:bg-secondary/20" />
                <div className="space-y-2">
                  <div className="h-4 w-36 rounded bg-BorderLight dark:bg-secondary/20" />
                  <div className="h-3 w-24 rounded bg-BorderLight dark:bg-secondary/20" />
                </div>
              </div>
              <div className="size-8 rounded-full bg-BorderLight dark:bg-secondary/20" />
            </div>

            <div className="space-y-2 mb-4">
              <div className="h-3 w-full rounded bg-BorderLight dark:bg-secondary/20" />
              <div className="h-3 w-3/4 rounded bg-BorderLight dark:bg-secondary/20" />
            </div>

            <div className="flex gap-2 mb-4">
              <div className="h-6 w-20 rounded-full bg-BorderLight dark:bg-secondary/20" />
              <div className="h-6 w-20 rounded-full bg-BorderLight dark:bg-secondary/20" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-20 rounded bg-BorderLight dark:bg-secondary/20" />
                <div className="h-3 w-28 rounded bg-BorderLight dark:bg-secondary/20" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-24 rounded bg-BorderLight dark:bg-secondary/20" />
                <div className="h-3 w-16 rounded bg-BorderLight dark:bg-secondary/20" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-Border dark:border-secondary">
              <div className="flex justify-between items-center">
                <div className="h-3 w-28 rounded bg-BorderLight dark:bg-secondary/20" />
                <div className="h-8 w-20 rounded-lg bg-BorderLight dark:bg-secondary/20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedJobsSkeleton
