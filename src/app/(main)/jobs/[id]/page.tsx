import { type Metadata } from "next"
import { getJobById } from "@/lib/api/public/jobsApi"
import JobDetails from "@/components/AllJobs/Details/JobDetails"
import JobDetailsSkeleton from "@/components/AllJobs/Details/JobDetailsSkeleton"
import { Suspense } from "react"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Job Details | HireMind",
  description: "View job details and apply",
}

const JobDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params
  let job = null
  let error = false

  try {
    job = await getJobById(id)
  } catch {
    error = true
  }

  if (error) {
    return (
      <div className="min-h-screen bg-Background dark:bg-[#0f172a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
            Something went wrong
          </h1>
          <p className="text-TextMuted font-SecondaryFont">
            Unable to load job details. Please try again later.
          </p>
          <a
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-SecondaryFont text-PrimaryColor hover:underline cursor-pointer"
          >
            ← Back to Jobs
          </a>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-Background dark:bg-[#0f172a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
            Job not found
          </h1>
          <p className="text-TextMuted font-SecondaryFont">
            This job may have been removed or is no longer available.
          </p>
          <a
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-SecondaryFont text-PrimaryColor hover:underline cursor-pointer"
          >
            ← Back to Jobs
          </a>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<JobDetailsSkeleton />}>
      <JobDetails job={job} />
    </Suspense>
  )
}

export default JobDetailsPage
