"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { type Job } from "@/lib/api/public/jobsApi"
import {
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Users,
  Share2,
  Briefcase,
  CheckCircle2,
  Gift,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import SaveJobButton from "./SaveJobButton"
import ApplyModal from "./ApplyModal"
import { useSession } from "@/lib/auth-client"
import { checkIfApplied } from "@/lib/api/seeker/applicationsApi"

interface JobDetailsProps {
  job: Job
}

const JobDetails = ({ job }: JobDetailsProps) => {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  const [modalOpen, setModalOpen] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [checkingApplied, setCheckingApplied] = useState(true)

  const daysLeft = Math.ceil(
    (new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  useEffect(() => {
    if (!user) {
      setCheckingApplied(false)
      return
    }
    checkIfApplied(job._id)
      .then((res) => setAlreadyApplied(res.applied))
      .catch(() => {})
      .finally(() => setCheckingApplied(false))
  }, [job._id, user])

  const handleApplyClick = () => {
    if (!user) {
      router.push("/login")
      return
    }
    if (alreadyApplied) return
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-Background dark:bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <a
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-SecondaryFont text-TextMuted hover:text-PrimaryColor transition-colors mb-6 cursor-pointer"
        >
          ← Back to Jobs
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-Surface dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor" />
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="relative size-16 rounded-2xl overflow-hidden bg-BorderLight dark:bg-secondary/20 shrink-0">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-2xl font-bold font-PrimaryFont text-PrimaryColor">
                        {job.companyName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
                      {job.title}
                    </h1>
                    <p className="mt-1 text-lg font-SecondaryFont text-TextSecondary dark:text-surface">
                      {job.companyName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 px-3 py-1.5 text-xs font-medium font-SecondaryFont text-PrimaryColor">
                    <Briefcase className="size-3.5" />
                    {job.jobType}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20 px-3 py-1.5 text-xs font-medium font-SecondaryFont text-SrcPrimaryColor">
                    <span className="size-3.5">📌</span>
                    {job.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-Warning/10 px-3 py-1.5 text-xs font-medium font-SecondaryFont text-Warning">
                    <Clock className="size-3.5" />
                    {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-Border dark:border-secondary">
                  <div className="flex items-center gap-2 text-sm font-SecondaryFont text-TextSecondary dark:text-surface">
                    <MapPin className="size-4 text-TextMuted shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-SecondaryFont text-TextSecondary dark:text-surface">
                    <DollarSign className="size-4 text-TextMuted shrink-0" />
                    <span>
                      ${job.salaryMin.toLocaleString()} - $
                      {job.salaryMax.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-SecondaryFont text-TextSecondary dark:text-surface">
                    <Calendar className="size-4 text-TextMuted shrink-0" />
                    <span>
                      Deadline:{" "}
                      {new Date(job.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-SecondaryFont text-TextSecondary dark:text-surface">
                    <Users className="size-4 text-TextMuted shrink-0" />
                    <span>
                      {job.applicationCount} applicant
                      {job.applicationCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-Surface dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-6 sm:p-8">
              <h2 className="text-xl font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-4">
                Job Description
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none font-SecondaryFont text-TextSecondary dark:text-surface leading-relaxed whitespace-pre-wrap">
                {job.fullDescription || job.shortDescription}
              </div>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-Surface dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-6 sm:p-8">
                <h2 className="text-xl font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-4">
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm font-SecondaryFont text-TextSecondary dark:text-surface"
                    >
                      <CheckCircle2 className="size-4 text-SrcPrimaryColor shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-Surface dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-6 sm:p-8">
                <h2 className="text-xl font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-4">
                  Benefits
                </h2>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm font-SecondaryFont text-TextSecondary dark:text-surface"
                    >
                      <Gift className="size-4 text-PrimaryColor shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-Surface dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-6 sticky top-24">
              <h3 className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-4">
                Quick Apply
              </h3>

              {checkingApplied ? (
                <Button
                  disabled
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white font-SecondaryFont font-semibold cursor-not-allowed"
                >
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Checking...
                </Button>
              ) : alreadyApplied ? (
                <Button
                  disabled
                  className="w-full h-11 rounded-xl bg-SrcPrimaryColor/20 text-SrcPrimaryColor font-SecondaryFont font-semibold cursor-not-allowed"
                >
                  <CheckCircle2 className="size-4 mr-2" />
                  Already Applied
                </Button>
              ) : (
                <Button
                  onClick={handleApplyClick}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white font-SecondaryFont font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Apply Now
                  <ExternalLink className="size-4 ml-2" />
                </Button>
              )}

              <div className="flex gap-3 mt-4">
                <SaveJobButton jobId={job._id} />
                <Button
                  variant="outline"
                  className="flex-1 h-10 rounded-xl border-Border dark:border-secondary font-SecondaryFont text-sm cursor-pointer"
                >
                  <Share2 className="size-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-Border dark:border-secondary">
                <h4 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white mb-3">
                  Posted by
                </h4>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full overflow-hidden bg-BorderLight dark:bg-secondary/20 shrink-0">
                    {job.recruiterImage ? (
                      <img
                        src={job.recruiterImage}
                        alt={job.recruiterName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-sm font-bold text-SrcPrimaryColor">
                        {job.recruiterName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white truncate">
                      {job.recruiterName}
                    </p>
                    <p className="text-xs font-SecondaryFont text-TextMuted truncate">
                      {job.recruiterEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-Border dark:border-secondary text-xs font-SecondaryFont text-TextMuted space-y-1">
                <p>
                  Posted:{" "}
                  {new Date(job.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p>
                  Job ID: {job._id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplyModal
        job={job}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onApplySuccess={() => setAlreadyApplied(true)}
      />
    </div>
  )
}

export default JobDetails
