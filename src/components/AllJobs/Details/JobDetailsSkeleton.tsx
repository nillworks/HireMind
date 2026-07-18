const JobDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-Background dark:bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-4 w-24 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-Surface dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary overflow-hidden">
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-start gap-5">
                  <div className="size-16 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
                  <div className="space-y-3 flex-1">
                    <div className="h-8 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="h-5 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="h-8 w-28 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
                <div className="grid grid-cols-4 gap-4 pt-6 border-t border-Border dark:border-secondary">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-Surface dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-6 sm:p-8 space-y-4">
              <div className="h-6 w-36 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            </div>

            <div className="bg-Surface dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-6 sm:p-8 space-y-4">
              <div className="h-6 w-32 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="size-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
                    <div className="h-4 flex-1 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-Surface dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-6 space-y-4">
              <div className="h-6 w-28 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-11 w-full rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="flex gap-3">
                <div className="h-10 flex-1 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-10 flex-1 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
              <div className="pt-4 border-t border-Border dark:border-secondary space-y-3">
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailsSkeleton
