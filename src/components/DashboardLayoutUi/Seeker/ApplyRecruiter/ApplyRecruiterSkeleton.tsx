const ApplyRecruiterSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-BorderLight dark:bg-secondary/20 animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-BorderLight dark:bg-secondary/20 animate-pulse" />
          <div className="h-4 w-64 rounded bg-BorderLight dark:bg-secondary/20 animate-pulse" />
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-8 animate-pulse">
        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 rounded bg-BorderLight dark:bg-secondary/20" />
              <div className="h-10 w-full rounded-xl bg-BorderLight dark:bg-secondary/20" />
            </div>
          ))}
          <div className="h-10 w-40 rounded-xl bg-BorderLight dark:bg-secondary/20" />
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6 animate-pulse">
        <div className="h-5 w-48 rounded bg-BorderLight dark:bg-secondary/20 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl bg-Background dark:bg-dark-bg"
            >
              <div className="size-9 rounded-lg bg-BorderLight dark:bg-secondary/20 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 rounded bg-BorderLight dark:bg-secondary/20" />
                <div className="h-3 w-full rounded bg-BorderLight dark:bg-secondary/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ApplyRecruiterSkeleton
