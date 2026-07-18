"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Eye, MapPin, DollarSign, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Job } from "@/lib/api/public/jobsApi"
import { type SavedJob } from "@/lib/api/public/savedJobsApi"
import { toggleSaveJob } from "@/lib/api/public/savedJobsApi"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface SavedJobWithDetails extends SavedJob {
  job: Job
}

interface SavedJobCardProps {
  savedJob: SavedJobWithDetails
  onRemove: (item: SavedJobWithDetails) => void
  isRemoving: boolean
}

const SavedJobCard = ({ savedJob, onRemove, isRemoving }: SavedJobCardProps) => {
  const { job } = savedJob
  const [isSaved, setIsSaved] = useState(true)

  const daysLeft = Math.ceil(
    (new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  const isExpired = daysLeft <= 0

  const hasValidLogo =
    job.companyLogo &&
    (job.companyLogo.startsWith("http://") ||
      job.companyLogo.startsWith("https://"))

  const handleToggleSave = async () => {
    try {
      const res = await toggleSaveJob(job._id)
      setIsSaved(res.saved)
      if (!res.saved) {
        onRemove(savedJob)
      }
      toast.success(res.saved ? "Job saved" : "Job removed from saved")
    } catch {
      toast.error("Failed to update save status")
    }
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-PrimaryColor/5 hover:-translate-y-0.5",
        isRemoving && "opacity-50 pointer-events-none"
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor" />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <Link
            href={`/jobs/${job._id}`}
            className="flex items-center gap-3 min-w-0 flex-1"
          >
            {hasValidLogo ? (
              <div className="relative size-12 shrink-0 rounded-xl overflow-hidden border border-Border dark:border-secondary">
                <Image
                  src={job.companyLogo}
                  alt={job.companyName}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            ) : (
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20">
                <span className="text-lg font-bold font-PrimaryFont text-PrimaryColor">
                  {job.companyName?.charAt(0)}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-surface truncate group-hover:text-PrimaryColor transition-colors">
                {job.title}
              </h3>
              <p className="text-xs font-SecondaryFont text-TextMuted truncate">
                {job.companyName}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleToggleSave}
            disabled={isRemoving}
            className={cn(
              "size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer",
              "hover:bg-PrimaryColorLight dark:hover:bg-PrimaryColorDark/20",
              isSaved
                ? "text-PrimaryColor"
                : "text-TextMuted hover:text-PrimaryColor"
            )}
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            <Heart
              size={18}
              className={cn(
                "transition-all duration-200",
                isSaved && "fill-PrimaryColor"
              )}
            />
          </button>
        </div>

        <p className="text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary line-clamp-2 mb-4">
          {job.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center rounded-full bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 px-2.5 py-1 text-[11px] font-medium font-SecondaryFont text-PrimaryColor">
            {job.jobType}
          </span>
          <span className="inline-flex items-center rounded-full bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20 px-2.5 py-1 text-[11px] font-medium font-SecondaryFont text-SrcPrimaryColor">
            {job.category}
          </span>
          {isExpired && (
            <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-500/10 px-2.5 py-1 text-[11px] font-medium font-SecondaryFont text-red-500">
              Expired
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1 text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary">
            <MapPin size={12} className="text-TextMuted shrink-0" />
            <span className="truncate">{job.location || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary">
            <DollarSign size={12} className="text-SrcPrimaryColor shrink-0" />
            <span>
              ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-SecondaryFont text-TextMuted">
          <span className="inline-flex items-center gap-1">
            <Calendar size={11} className="shrink-0" />
            Saved{" "}
            {new Date(savedJob.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={11} className="shrink-0" />
            <span
              className={cn(
                isExpired
                  ? "text-red-500 font-medium"
                  : daysLeft <= 7
                    ? "text-PrimaryColor font-medium"
                    : ""
              )}
            >
              {isExpired ? "Expired" : `${daysLeft}d left`}
            </span>
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-Border dark:border-secondary">
          <Link href={`/jobs/${job._id}`} className="cursor-pointer">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "w-full h-8 rounded-lg font-SecondaryFont text-xs border-Border dark:border-secondary transition-colors cursor-pointer",
                "text-TextSecondary dark:text-text-secondary hover:bg-PrimaryColorLight dark:hover:bg-PrimaryColorDark/20 hover:text-PrimaryColor hover:border-PrimaryColor/30"
              )}
            >
              <Eye size={14} />
              View Details
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  )
}

export default SavedJobCard
