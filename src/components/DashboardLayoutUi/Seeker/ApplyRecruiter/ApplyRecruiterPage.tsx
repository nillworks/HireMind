"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"
import { useSession } from "@/lib/auth-client"
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

interface FieldErrors {
  company?: string
  companyWebsite?: string
  experience?: string
  description?: string
}

const initialFormData: RecruiterApplyData = {
  name: "",
  company: "",
  companyWebsite: "",
  description: "",
  experience: "",
}

const isValidUrl = (url: string) => {
  if (!url.trim()) return true
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

const ApplyRecruiterPage = () => {
  const { data: session } = useSession()
  const user = session?.user

  const [status, setStatus] = useState<RecruiterStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<RecruiterApplyData>(initialFormData)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    getRecruiterApplyStatus()
      .then(setStatus)
      .catch(() => setStatus({ status: "none" }))
      .finally(() => setLoading(false))
  }, [])

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {}
    if (!formData.company.trim()) errs.company = "Company name is required"
    if (formData.companyWebsite.trim() && !isValidUrl(formData.companyWebsite)) {
      errs.companyWebsite = "Please enter a valid URL (e.g. https://example.com)"
    }
    if (formData.experience && (isNaN(Number(formData.experience)) || Number(formData.experience) < 0)) {
      errs.experience = "Please enter a valid number"
    }
    if (formData.description.trim() && formData.description.trim().length < 10) {
      errs.description = "Please write at least 10 characters"
    }
    return errs
  }

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "company":
        return value.trim() ? undefined : "Company name is required"
      case "companyWebsite":
        return value.trim() && !isValidUrl(value) ? "Please enter a valid URL (e.g. https://example.com)" : undefined
      case "experience":
        return value && (isNaN(Number(value)) || Number(value) < 0) ? "Please enter a valid number" : undefined
      case "description":
        return value.trim() && value.trim().length < 10 ? "Please write at least 10 characters" : undefined
      default:
        return undefined
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const err = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: err }))
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const err = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const allTouched = { company: true, companyWebsite: true, experience: true, description: true }
    setTouched(allTouched)
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      await applyAsRecruiter({
        ...formData,
        name: formData.name || user?.name || "",
        userImage: user?.image || "",
      })
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
        currentStatus === "rejected") && (
        <StatusBanner
          status={currentStatus}
          rejectionReason={status?.rejectionReason}
        />
      )}

      {currentStatus === "none" && (
        <ApplicationForm
          formData={formData}
          onChange={handleChange}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
          errors={errors}
          touched={touched}
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
          onBlur={handleBlur}
          onSubmit={handleSubmit}
          errors={errors}
          touched={touched}
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
