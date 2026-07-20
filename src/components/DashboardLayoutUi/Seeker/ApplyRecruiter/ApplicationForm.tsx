"use client"

import {
  Building2,
  Globe,
  FileText,
  Briefcase,
  Loader2,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { RecruiterApplyData } from "@/lib/api/seeker/recruiterApplyApi"
import { cn } from "@/lib/utils"

const baseInputClasses =
  "h-10 bg-white dark:bg-[#0f172a] text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted rounded-xl transition-colors"

const textareaClasses =
  "flex w-full rounded-xl border bg-white dark:bg-[#0f172a] px-3 py-2.5 text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted outline-none transition-colors resize-none"

interface FieldErrors {
  company?: string
  companyWebsite?: string
  experience?: string
  description?: string
}

interface ApplicationFormProps {
  formData: RecruiterApplyData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  errors: FieldErrors
  touched: Record<string, boolean>
  submitting: boolean
  title: string
  subtitle: string
  submitLabel: string
}

function FormField({
  label,
  required,
  error,
  touched,
  valid,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  touched?: boolean
  valid?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-surface">
        {label}
        {required && <span className="text-PrimaryColor ml-0.5">*</span>}
      </Label>
      {children}
      {error && touched && (
        <p className="flex items-center gap-1 text-xs text-PrimaryColor font-SecondaryFont">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
      {valid && touched && !error && (
        <p className="flex items-center gap-1 text-xs text-SrcPrimaryColor font-SecondaryFont">
          <CheckCircle2 size={11} />
          Looks good
        </p>
      )}
    </div>
  )
}

const ApplicationForm = ({
  formData,
  onChange,
  onBlur,
  onSubmit,
  errors,
  touched,
  submitting,
  title,
  subtitle,
  submitLabel,
}: ApplicationFormProps) => {
  const inputBorder = (name: string) =>
    errors[name as keyof FieldErrors] && touched[name]
      ? "border-PrimaryColor focus:border-PrimaryColor focus:ring-2 focus:ring-PrimaryColor/20"
      : formData[name as keyof RecruiterApplyData] && !errors[name as keyof FieldErrors]
        ? "border-SrcPrimaryColor focus:border-SrcPrimaryColor focus:ring-2 focus:ring-SrcPrimaryColor/20"
        : "border-Border dark:border-secondary focus:border-PrimaryColor focus:ring-2 focus:ring-PrimaryColor/20"

  const iconRight = (name: string) => {
    const val = formData[name as keyof RecruiterApplyData]
    if (val && !errors[name as keyof FieldErrors]) {
      return (
        <CheckCircle2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-SrcPrimaryColor pointer-events-none" />
      )
    }
    return null
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary overflow-hidden">
      <div className="p-6 border-b border-Border dark:border-secondary">
        <h2 className="text-lg font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
          {title}
        </h2>
        <p className="text-sm font-SecondaryFont text-TextMuted mt-1">
          {subtitle}
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-5">
        <FormField
          label="Company Name"
          required
          error={errors.company}
          touched={touched.company}
          valid={!!formData.company}
        >
          <div className="relative">
            <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted" />
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="e.g. Acme Corporation"
              required
              className={cn(baseInputClasses, "pl-9", inputBorder("company"))}
            />
            {iconRight("company")}
          </div>
        </FormField>

        <FormField
          label="Company Website"
          error={errors.companyWebsite}
          touched={touched.companyWebsite}
          valid={!!formData.companyWebsite && !errors.companyWebsite}
        >
          <div className="relative">
            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted" />
            <Input
              id="companyWebsite"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="e.g. https://acme.com"
              className={cn(baseInputClasses, "pl-9", inputBorder("companyWebsite"))}
            />
            {iconRight("companyWebsite")}
          </div>
        </FormField>

        <FormField
          label="Years of Experience"
          error={errors.experience}
          touched={touched.experience}
          valid={!!formData.experience && !errors.experience}
        >
          <div className="relative">
            <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted" />
            <Input
              id="experience"
              name="experience"
              type="number"
              min="0"
              max="50"
              value={formData.experience}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="e.g. 5"
              className={cn(baseInputClasses, "pl-9", inputBorder("experience"))}
            />
            {iconRight("experience")}
          </div>
        </FormField>

        <FormField
          label="Company Description"
          error={errors.description}
          touched={touched.description}
          valid={!!formData.description && !errors.description}
        >
          <div className="relative">
            <FileText size={16} className="absolute left-3 top-3 text-TextMuted" />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Tell us about your company, what you do, and what kind of talent you're looking for..."
              rows={4}
              className={cn(textareaClasses, "pl-9", inputBorder("description"))}
            />
            {formData.description && !errors.description && (
              <CheckCircle2 size={15} className="absolute right-3 top-3 text-SrcPrimaryColor pointer-events-none" />
            )}
          </div>
        </FormField>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={submitting}
            className="h-10 px-6 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor hover:from-PrimaryColorHover hover:to-SrcPrimaryColorHover text-white font-SecondaryFont font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer w-full"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} />
                {submitLabel}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ApplicationForm
