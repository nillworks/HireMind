import { Suspense } from 'react'
import AllJobsPage from '@/components/AllJobs/AllJobsPage'
import JobCardSkeleton from '@/components/AllJobs/JobCardSkeleton'

const JobsFallback = () => (
  <div className="min-h-screen bg-Background dark:bg-[#0f172a]">
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  </div>
)

const page = () => {
  return (
    <Suspense fallback={<JobsFallback />}>
      <AllJobsPage />
    </Suspense>
  )
}

export default page
