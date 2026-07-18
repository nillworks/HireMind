"use client"

import {
  Building2,
  Globe,
  FileText,
  Briefcase,
  Loader2,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { RecruiterApplyData } from "@/lib/api/seeker/recruiterApplyApi"
import { cn } from "@/lib/utils"

const inputClasses =
  "h-10 bg-white dark:bg-[#0f172a] border-Border dark:border-secondary text-TextPrimary dark:text-surface font-SecondaryFont placeholder:text-TextMuted rounded-xl focus-visible:ring-2 focus-visible:ring-PrimaryColor/20 focus-visible:border-PrimaryColor"

const textareaClasses =
  "flex w-full rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#0f172a] px-3 py-2.5 text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted outline-none focus:border-PrimaryColor focus:ring-2 focus:ring-PrimaryColor/20 transition-colors resize-none"

interface ApplicationFormProps {
  formData: RecruiterApplyData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  submitting: boolean
  title: string
  subtitle: string
  submitLabel: string
}

const ApplicationForm = ({
  formData,
  onChange,
  onSubmit,
  submitting,
  title,
  subtitle,
  submitLabel,
}: ApplicationFormProps) => {
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
        <div className="space-y-2">
          <Label
            htmlFor="company"
            className="text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-surface"
          >
            Company Name <span className="text-PrimaryColor">*</span>
          </Label>
          <div className="relative">
            <Building2
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
            />
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={onChange}
              placeholder="e.g. Acme Corporation"
              required
              className={cn(inputClasses, "pl-9")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="companyWebsite"
            className="text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-surface"
          >
            Company Website
          </Label>
          <div className="relative">
            <Globe
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
            />
            <Input
              id="companyWebsite"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={onChange}
              placeholder="e.g. https://acme.com"
              className={cn(inputClasses, "pl-9")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="experience"
            className="text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-surface"
          >
            Years of Experience
          </Label>
          <div className="relative">
            <Briefcase
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
            />
            <Input
              id="experience"
              name="experience"
              type="number"
              min="0"
              max="50"
              value={formData.experience}
              onChange={onChange}
              placeholder="e.g. 5"
              className={cn(inputClasses, "pl-9")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-surface"
          >
            Company Description
          </Label>
          <div className="relative">
            <FileText
              size={16}
              className="absolute left-3 top-3 text-TextMuted"
            />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Tell us about your company, what you do, and what kind of talent you're looking for..."
              rows={4}
              className={cn(textareaClasses, "pl-9")}
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={submitting}
            className="h-10 px-6 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor hover:from-PrimaryColorHover hover:to-SrcPrimaryColorHover text-white font-SecondaryFont font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
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
