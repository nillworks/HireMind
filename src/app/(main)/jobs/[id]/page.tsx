import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { getJobById } from "@/lib/api/public/jobsApi"
import JobDetails from "@/components/AllJobs/Details/JobDetails"
import JobDetailsSkeleton from "@/components/AllJobs/Details/JobDetailsSkeleton"
import { Suspense } from "react"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Job Details | TalentAI",
  description: "View job details and apply",
}

const JobDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params
  const job = await getJobById(id)

  if (!job) {
    notFound()
  }

  return (
    <Suspense fallback={<JobDetailsSkeleton />}>
      <JobDetails job={job} />
    </Suspense>
  )
}

export default JobDetailsPage
