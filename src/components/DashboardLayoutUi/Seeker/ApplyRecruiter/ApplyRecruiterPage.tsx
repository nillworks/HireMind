"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"
import {
  applyAsRecruiter,
  getRecruiterApplyStatus,
  type RecruiterApplyData,
  type RecruiterStatusResponse,
} from "@/lib/api/seeker/recruiterApplyApi"
import ApplyRecruiterSkeleton from "./ApplyRecruiterSkeleton"
import StatusBanner from "./StatusBanner"
import ApplicationForm from "./ApplicationForm"
import ApprovedCard from "./ApprovedCard"
import BenefitsSection from "./BenefitsSection"

const initialFormData: RecruiterApplyData = {
  name: "",
  company: "",
  companyWebsite: "",
  description: "",
  experience: "",
}

const ApplyRecruiterPage = () => {
  const [status, setStatus] = useState<RecruiterStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<RecruiterApplyData>(initialFormData)

  useEffect(() => {
    getRecruiterApplyStatus()
      .then(setStatus)
      .catch(() => setStatus({ status: "none" }))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.company.trim()) {
      toast.error("Company name is required")
      return
    }
    setSubmitting(true)
    try {
      await applyAsRecruiter(formData)
      toast.success("Application submitted successfully!")
      setStatus({ status: "pending" })
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit application"
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <ApplyRecruiterSkeleton />

  const currentStatus = status?.status || "none"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20">
          <UserPlus size={20} className="text-PrimaryColor" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
            Apply as Recruiter
          </h1>
          <p className="text-sm font-SecondaryFont text-TextMuted">
            Upgrade your account to post jobs and find top talent
          </p>
        </div>
      </div>

      {(currentStatus === "pending" ||
        currentStatus === "approved" ||
        currentStatus === "rejected") && <StatusBanner status={currentStatus} />}

      {currentStatus === "none" && (
        <ApplicationForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitting={submitting}
          title="Recruiter Application"
          subtitle="Fill in your details to apply for a recruiter account"
          submitLabel="Submit Application"
        />
      )}

      {currentStatus === "rejected" && (
        <ApplicationForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitting={submitting}
          title="Reapply as Recruiter"
          subtitle="You can submit a new application with updated information"
          submitLabel="Reapply Now"
        />
      )}

      {currentStatus === "approved" && <ApprovedCard />}

      <BenefitsSection />
    </div>
  )
}

export default ApplyRecruiterPage
