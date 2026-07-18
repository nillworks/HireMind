"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { Heart, Search, Briefcase, FolderOpen } from "lucide-react"
import {
  getSavedJobs,
  toggleSaveJob,
  type SavedJob,
} from "@/lib/api/public/savedJobsApi"
import { getJobById, type Job } from "@/lib/api/public/jobsApi"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import SavedJobCard from "./SavedJobCard"
import SavedJobsSkeleton from "./SavedJobsSkeleton"

interface SavedJobWithDetails extends SavedJob {
  job: Job
}

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJobWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [removingId, setRemovingId] = useState<string | null>(null)

  const fetchSavedJobs = useCallback(async () => {
    setLoading(true)
    try {
      const items = await getSavedJobs()
      const withDetails = await Promise.all(
        items.map(async (item) => {
          const job = await getJobById(item.jobId)
          return job ? { ...item, job } : null
        })
      )
      setSavedJobs(
        withDetails.filter(
          (item): item is SavedJobWithDetails => item !== null
        )
      )
    } catch {
      setSavedJobs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSavedJobs()
  }, [fetchSavedJobs])

  const handleRemove = useCallback(async (item: SavedJobWithDetails) => {
    setRemovingId(item.job._id)
    try {
      await toggleSaveJob(item.job._id)
      setSavedJobs((prev) => prev.filter((j) => j.jobId !== item.jobId))
      toast.success("Job removed from saved")
    } catch {
      toast.error("Failed to remove job")
    } finally {
      setRemovingId(null)
    }
  }, [])

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return savedJobs
    const query = searchQuery.toLowerCase()
    return savedJobs.filter(
      (item) =>
        item.job.title.toLowerCase().includes(query) ||
        item.job.companyName.toLowerCase().includes(query) ||
        item.job.location.toLowerCase().includes(query) ||
        item.job.category.toLowerCase().includes(query)
    )
  }, [savedJobs, searchQuery])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20">
          <Heart size={20} className="text-PrimaryColor" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
            Saved Jobs
          </h1>
          <p className="text-sm font-SecondaryFont text-TextMuted">
            Jobs you&apos;ve bookmarked for later
          </p>
        </div>
      </div>

      {loading ? (
        <SavedJobsSkeleton />
      ) : savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20 mb-4">
            <Heart size={28} className="text-PrimaryColor" />
          </div>
          <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
            No saved jobs yet
          </h3>
          <p className="text-sm font-SecondaryFont text-TextMuted mt-1 text-center max-w-sm">
            Start saving jobs you&apos;re interested in and they&apos;ll appear
            here.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 mt-6 h-9 px-5 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white text-sm font-semibold font-SecondaryFont hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Briefcase size={16} />
            Browse Jobs
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, company, location..."
                className={cn(
                  "w-full h-10 pl-9 pr-4 rounded-xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary",
                  "text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted",
                  "focus:outline-none focus:ring-2 focus:ring-PrimaryColor/20 focus:border-PrimaryColor transition-all"
                )}
              />
            </div>
            <div className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary">
              <Briefcase size={14} className="text-TextMuted" />
              <span className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary">
                {filteredJobs.length} saved
                {filteredJobs.length !== 1 ? " jobs" : " job"}
              </span>
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredJobs.map((item) => (
                <SavedJobCard
                  key={item._id}
                  savedJob={item}
                  onRemove={handleRemove}
                  isRemoving={removingId === item.job._id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20 mb-4">
                <FolderOpen size={28} className="text-PrimaryColor" />
              </div>
              <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
                No matching jobs found
              </h3>
              <p className="text-sm font-SecondaryFont text-TextMuted mt-1 text-center max-w-sm">
                Try adjusting your search terms to find what you&apos;re looking
                for.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 h-9 px-4 rounded-xl font-SecondaryFont text-sm border border-Border dark:border-secondary text-SrcPrimaryColor hover:bg-SrcPrimaryColorLight dark:hover:bg-SrcPrimaryColorDark/20 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SavedJobsPage
